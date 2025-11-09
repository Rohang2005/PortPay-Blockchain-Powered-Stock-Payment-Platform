import { Wallet, Plus, Bell, HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export const Header = () => {
  const { currentUser } = useUser();
  
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-card/80 backdrop-blur-md border-b border-border px-6 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg border border-border hover:shadow-glow transition-all duration-200">
          <Wallet className="w-5 h-5 text-primary" />
          <div className="text-left">
            <p className="text-xs text-muted-foreground">Wallet</p>
            <p className="text-sm font-bold text-foreground">
              ₹{currentUser?.portfolioValue?.toLocaleString() || '0'}
            </p>
          </div>
        </button>
        <Button size="sm" className="gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 border-0 shadow-glow">
          <Plus className="w-4 h-4" />
          Add Funds
        </Button>
        <button className="p-2 rounded-lg border border-border hover:bg-secondary/60 transition-all duration-200">
          <Bell className="w-5 h-5 text-foreground" />
        </button>
        <button className="p-2 rounded-lg border border-border hover:bg-secondary/60 transition-all duration-200">
          <HelpCircle className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
};
