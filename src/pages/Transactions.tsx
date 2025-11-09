import { useState, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { TransactionCard } from "@/components/TransactionCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Calendar, ArrowUpDown } from "lucide-react";

// Extended mock transactions data
const mockTransactions = [
  { id: 1, name: "Rahul Sharma", type: "sent" as const, amount: 5000, timestamp: "Today, 2:30 PM", initials: "RS", date: new Date(), category: "Personal" },
  { id: 2, name: "Priya Verma", type: "received" as const, amount: 12500, timestamp: "Today, 11:45 AM", initials: "PV", date: new Date(), category: "Business" },
  { id: 3, name: "Amazon India", type: "sent" as const, amount: 3200, timestamp: "Yesterday, 6:20 PM", initials: "AI", date: new Date(Date.now() - 86400000), category: "Shopping" },
  { id: 4, name: "Amit Patel", type: "received" as const, amount: 8000, timestamp: "Yesterday, 3:15 PM", initials: "AP", date: new Date(Date.now() - 86400000), category: "Business" },
  { id: 5, name: "Swiggy", type: "sent" as const, amount: 450, timestamp: "2 days ago", initials: "SW", date: new Date(Date.now() - 172800000), category: "Food" },
  { id: 6, name: "Netflix", type: "sent" as const, amount: 799, timestamp: "3 days ago", initials: "NF", date: new Date(Date.now() - 259200000), category: "Entertainment" },
  { id: 7, name: "Sneha Roy", type: "received" as const, amount: 15000, timestamp: "3 days ago", initials: "SR", date: new Date(Date.now() - 259200000), category: "Personal" },
  { id: 8, name: "Uber", type: "sent" as const, amount: 280, timestamp: "4 days ago", initials: "UB", date: new Date(Date.now() - 345600000), category: "Transport" },
  { id: 9, name: "Karan Singh", type: "received" as const, amount: 7500, timestamp: "5 days ago", initials: "KS", date: new Date(Date.now() - 432000000), category: "Business" },
  { id: 10, name: "Spotify", type: "sent" as const, amount: 199, timestamp: "1 week ago", initials: "SP", date: new Date(Date.now() - 604800000), category: "Entertainment" },
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions.filter(transaction => {
      const matchesSearch = transaction.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || transaction.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
      
      return matchesSearch && matchesType && matchesCategory;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "date":
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, typeFilter, categoryFilter, sortBy, sortOrder]);

  const totalSent = mockTransactions
    .filter(t => t.type === "sent")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalReceived = mockTransactions
    .filter(t => t.type === "received")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen transition-all duration-300">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
              <p className="text-muted-foreground mt-1">Manage and track all your stock-based payments</p>
            </div>
            <Button className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 border-0 shadow-glow">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border border-border shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sent</p>
                  <p className="text-2xl font-bold text-destructive">₹{totalSent.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <ArrowUpDown className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card border border-border shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Received</p>
                  <p className="text-2xl font-bold text-success">₹{totalReceived.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <ArrowUpDown className="w-6 h-6 text-success rotate-180" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-card border border-border shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Balance</p>
                  <p className={`text-2xl font-bold ${totalReceived - totalSent >= 0 ? 'text-success' : 'text-destructive'}`}>
                    ₹{(totalReceived - totalSent).toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${totalReceived - totalSent >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <ArrowUpDown className={`w-6 h-6 ${totalReceived - totalSent >= 0 ? 'text-success' : 'text-destructive'} ${totalReceived - totalSent < 0 ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="p-6 bg-card border border-border shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-secondary border-border focus:border-primary/50 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-40 bg-secondary border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-40 bg-secondary border-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-40 bg-secondary border-border">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Order */}
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="bg-secondary border-border hover:bg-secondary/80"
              >
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {sortOrder === "asc" ? "Asc" : "Desc"}
              </Button>
            </div>
          </Card>

          {/* Transactions List */}
          <Card className="bg-card border border-border shadow-lg">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                Transaction History ({filteredTransactions.length})
              </h2>
            </div>
            <div className="divide-y divide-border">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    name={transaction.name}
                    type={transaction.type}
                    amount={transaction.amount}
                    timestamp={transaction.timestamp}
                    initials={transaction.initials}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="text-muted-foreground">
                    <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
