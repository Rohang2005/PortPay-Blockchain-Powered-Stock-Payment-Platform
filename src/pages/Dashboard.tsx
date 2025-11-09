import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StockCard } from "@/components/StockCard";
import { TransactionCard } from "@/components/TransactionCard";
import { ContactCard } from "@/components/ContactCard";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TrendingUp, QrCode, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { fetchFHQuote, connectFinnhubWS } from "@/lib/finnhub";
import { useToast } from "@/components/ui/use-toast";

// --- CONTEXT & BLOCKCHAIN IMPORTS ---
import { useUser } from "@/context/UserContext";
// --- FIX for 'any' type error ---
import { ethers, Eip1193Provider } from "ethers";
import {
  PORTPAY_TOKEN_ADDRESS,
  PORTPAY_TOKEN_ABI,
  VAULT_CONTRACT_ADDRESS,
  VAULT_CONTRACT_ABI
} from "@/Blockchain/contracts";

// --- FIX for window.ethereum error ---
// This tells TypeScript the specific type for the ethereum provider.
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

// --- DUMMY DATA ---
const dummyStocksForPayment = [
    { name: "TCS Stock Token", value: 30, contract: PORTPAY_TOKEN_ADDRESS },
    { name: "Infosys Stock Token", value: 50, contract: PORTPAY_TOKEN_ADDRESS },
    { name: "HDFC Stock Token", value: 120, contract: PORTPAY_TOKEN_ADDRESS },
    { name: "Wipro Stock Token", value: 25, contract: PORTPAY_TOKEN_ADDRESS },
    { name: "Reliance Stock Token", value: 250, contract: PORTPAY_TOKEN_ADDRESS },
];

const trackedSymbols = [
  { options: ["MSFT"], name: "Reliance Industries", shares: 25 },
  { options: ["AAPL"], name: "Tata Consultancy Services", shares: 15 },
  { options: ["INFY"], name: "Infosys Limited", shares: 40 },
  { options: ["HDB"], name: "HDFC Bank", shares: 30 },
  { options: ["IBN"], name: "ICICI Bank", shares: 50 },
  { options: ["WIT"], name: "Wipro Limited", shares: 60 },
] as const;

const suggestedContacts = [
  { name: "Sneha Roy", initials: "SR", lastInteraction: "2 days ago" },
  { name: "Karan Singh", initials: "KS", lastInteraction: "1 week ago" },
  { name: "Neha Gupta", initials: "NG", lastInteraction: "3 days ago" },
  { name: "Vikram Desai", initials: "VD", lastInteraction: "5 days ago" },
];


const Dashboard = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uid, setUid] = useState("");
  const { toast } = useToast();
  
  const { currentUser, users, addTransaction } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [receiverWallet, setReceiverWallet] = useState({ uid: "", balance: 0.00 });
  const [selectedRecipient, setSelectedRecipient] = useState({ uid: "", address: "" });

  const onUploadClick = () => fileInputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({ title: "QR uploaded", description: `${file.name}` });
      e.currentTarget.value = "";
    }
  };

  const handleUidPayment = () => {
    if (!uid.trim()) {
      return toast({ title: "Invalid UID", description: "Please enter a valid UID" });
    }
    
    const recipient = users[uid.trim()];
    if (!recipient) {
      return toast({ title: "UID Not Found", description: "This UID does not exist in our simulation." });
    }
    if (recipient.uid === currentUser?.uid) {
        return toast({ title: "Invalid Recipient", description: "You cannot send a payment to yourself." });
    }

    setSelectedRecipient({ uid: recipient.uid, address: recipient.walletAddress });
    setReceiverWallet({ uid: recipient.uid, balance: users[recipient.uid].portfolioValue });
    setIsModalOpen(true);
  };

  const executePayment = async (stock: typeof dummyStocksForPayment[0]) => {
    const amountToPay = parseFloat(paymentAmount);
    if (isNaN(amountToPay) || amountToPay <= 0) {
        return toast({ title: "Invalid Amount", description: "Please enter a valid amount to pay." });
    }
    if (stock.value < amountToPay) {
        return toast({ title: "Insufficient Stock Value", description: `The selected stock (value ₹${stock.value}) is not enough to cover the payment of ₹${amountToPay}.` });
    }

    setIsModalOpen(false); 

    if (typeof window.ethereum === "undefined" || !currentUser) {
      return toast({ title: "Error", description: "MetaMask not found or user not logged in." });
    }

    try {
      toast({ title: "Processing...", description: "Please approve the transactions in your wallet." });

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      const tokenContract = new ethers.Contract(stock.contract, PORTPAY_TOKEN_ABI, signer);
      const vaultContract = new ethers.Contract(VAULT_CONTRACT_ADDRESS, VAULT_CONTRACT_ABI, signer);
      
      const tokenAmountToDeposit = ethers.parseUnits("1", 18);
      const paymentAmountInWei = ethers.parseUnits(amountToPay.toString(), 18);

      const approveTx = await tokenContract.approve(VAULT_CONTRACT_ADDRESS, tokenAmountToDeposit);
      await approveTx.wait();
      toast({ title: "Approval successful!", description: "Now processing payment..." });

      const depositTx = await vaultContract.depositForPayment(
        selectedRecipient.address,
        stock.contract,
        tokenAmountToDeposit,
        paymentAmountInWei
      );
      const receipt = await depositTx.wait();
      const blockchainTxId = receipt?.hash || "N/A";
      
      toast({ title: "Payment Successful!", description: `Sent ₹${amountToPay} to ${selectedRecipient.uid}` });
      
      addTransaction(currentUser.uid, selectedRecipient.uid, amountToPay, blockchainTxId);
      
      setUid(""); 
      setPaymentAmount("");

    } catch (error) {
      console.error("Payment failed:", error);
      toast({ title: "Payment Failed", description: "Transaction was rejected or failed." });
    }
  };

  useEffect(() => {
    if (selectedRecipient.uid && users[selectedRecipient.uid]) {
      setReceiverWallet({uid: selectedRecipient.uid, balance: users[selectedRecipient.uid].portfolioValue});
    }
  }, [users, selectedRecipient]);

  if (!currentUser) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading user data...</div>;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
    <div className="min-h-screen transition-all duration-300">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stock Portfolio Section */}
          <section className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Your Stock Portfolio</h2>
              <p className="text-sm text-muted-foreground">Last updated: Just now</p>
            </div>
            <StocksGrid />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Transactions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Transactions */}
              <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-bold text-foreground mb-4">Recent Transactions</h2>
                <Card className="bg-card border border-border shadow-lg divide-y divide-border">
                  {currentUser.transactions.map((transaction) => (
                    <TransactionCard key={transaction.id} {...transaction} />
                  ))}
                </Card>
                <div className="mt-4 flex items-center gap-3">
                  <Button
                    size="lg"
                    onClick={onUploadClick}
                    className="gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 border-0 shadow-glow transition-all duration-200"
                  >
                    <QrCode className="w-5 h-5" />
                    Upload QR
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">Choose a QR image from your files.</p>
                </div>
              </section>

              {/* Suggested Contacts */}
              <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-bold text-foreground mb-4">Frequent Contacts</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestedContacts.map((contact) => (
                    <ContactCard key={contact.initials} {...contact} />
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Summary & Stats */}
            <div className="space-y-6">
              {/* Upload QR Card */}
              <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <Card className="p-6 bg-card border border-border shadow-lg">
                  <Button
                    size="lg"
                    onClick={onUploadClick}
                    className="w-full h-20 gap-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 border-0 shadow-glow transition-all duration-200"
                  >
                    <QrCode className="w-6 h-6" />
                    Upload QR
                  </Button>
                </Card>
              </section>

              {/* UID Payment Card */}
              <section className="animate-fade-in" style={{ animationDelay: '0.12s' }}>
                <Card className="p-6 bg-card border border-border shadow-lg">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground text-center">UID Payment</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="uid" className="text-sm font-medium text-foreground">
                          UID
                        </Label>
                        <Input
                          id="uid"
                          type="text"
                          placeholder="Enter recipient UID"
                          value={uid}
                          onChange={(e) => setUid(e.target.value)}
                          className="bg-secondary/50 border-border focus:border-primary/50 focus:ring-primary/20"
                        />
                      </div>
                      <Button
                        onClick={handleUidPayment}
                        className="w-full h-12 gap-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white hover:from-green-300 hover:via-emerald-400 hover:to-teal-500 border-0 shadow-glow transition-all duration-200"
                      >
                        <Send className="w-4 h-4" />
                        Pay
                      </Button>
                    </div>
                  </div>
                </Card>
              </section>
              
              {/* Receiver's Wallet Display */}
              <section className="animate-fade-in" style={{ animationDelay: '0.13s' }}>
                  <Card className="p-6 bg-card border border-border shadow-lg">
                      <h3 className="text-lg font-bold text-foreground text-center mb-2">Receiver's Wallet</h3>
                      <p className="text-2xl font-bold text-center text-green-400">₹{receiverWallet.balance.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {receiverWallet.uid ? `Watching: ${receiverWallet.uid}` : "No recipient selected"}
                      </p>
                  </Card>
              </section>

              {/* Portfolio Summary */}
              <section className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
                <PortfolioSummary />
              </section>

              {/* Quick Stats */}
              <Card className="p-6 bg-card border border-border shadow-lg animate-fade-in" style={{ animationDelay: '0.25s' }}>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <h3 className="font-bold text-lg text-foreground">Top Performer</h3>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border bg-success-light/30">
                    <p className="text-xs text-muted-foreground mb-1">Best Stock Today</p>
                    <p className="text-lg font-bold text-success">WIPRO</p>
                    <p className="text-sm text-success">+3.21% ↑</p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">Total Transactions</p>
                    <p className="text-lg font-bold text-foreground">247</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
    
    <DialogContent className="bg-card border-border">
      <DialogHeader>
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogDescription>
            Enter the amount and select a stock to pay {selectedRecipient.uid}.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input 
                id="amount" 
                type="number" 
                placeholder="e.g., 10" 
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="bg-secondary/50 border-border focus:border-primary/50 focus:ring-primary/20"
            />
        </div>
        <div className="space-y-2">
          <Label>Choose a Stock to Use</Label>
          {dummyStocksForPayment.map((stock) => (
            <div 
              key={stock.name} 
              className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
              onClick={() => executePayment(stock)}
            >
              <p className="font-semibold">{stock.name}</p>
              <p className="text-green-400">Value: ₹{stock.value}</p>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
    </Dialog>
  );
};

export default Dashboard;

// --- StocksGrid Component ---
function StocksGrid() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<Record<string, { price: number; change: number; changePercent: number; prevClose?: number }>>({});

  const displaySymbols = useMemo(() => trackedSymbols.map((t) => t.options[0]), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          trackedSymbols.map(async (t) => {
            const sym = t.options[0];
            const q = await fetchFHQuote(sym);
            return [sym, { price: q.c, change: q.d, changePercent: q.dp, prevClose: q.pc }] as const;
          })
        );
        if (!cancelled) {
          const mapped: Record<string, { price: number; change: number; changePercent: number; prevClose?: number }> = {};
          for (const [sym, val] of results) mapped[sym] = val;
          setQuotes(mapped);
        }
      } catch (e: unknown) {
        if (!cancelled) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Failed to load stock prices");
            }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();

    const wsSymbols = trackedSymbols.map((t) => t.options[0]);
    const { unsubscribe } = connectFinnhubWS(wsSymbols, (symbol, price) => {
      if (cancelled) return;
      setQuotes((prev) => {
        const prevEntry = prev[symbol];
        const prevClose = prevEntry?.prevClose ?? prevEntry?.price ?? 0;
        const change = price - prevClose;
        const changePercent = prevClose ? (change / prevClose) * 100 : 0;
        return {
          ...prev,
          [symbol]: {
            price,
            prevClose,
            change,
            changePercent,
          },
        };
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackedSymbols.map((t, idx) => (
          <Card key={displaySymbols[idx]} className="p-5 animate-pulse bg-card border border-border shadow-lg">
            <div className="h-6 bg-muted rounded w-1/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2 mb-4" />
            <div className="h-8 bg-muted rounded w-2/3" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-5 bg-card border border-border shadow-lg">
        <p className="text-sm text-red-500">{error}</p>
        <p className="text-xs text-muted-foreground mt-1">Finnhub rate limits may apply; try again shortly.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trackedSymbols.map((t) => {
        const key = t.options.find((s) => quotes[s] !== undefined) || t.options[0];
        const q = quotes[key];
        const currentValue = q?.price ?? 0;
        const changeValue = q?.change ?? 0;
        const changePercent = q?.changePercent ?? 0;
        return (
          <StockCard
            key={key}
            symbol={key}
            name={t.name}
            currentValue={currentValue}
            changeValue={changeValue}
            changePercent={changePercent}
            shares={t.shares}
          />
        );
      })}
    </div>
  );
}

