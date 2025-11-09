import { Card } from "@/components/ui/card";
import { TrendingUp, Coins, PieChart } from "lucide-react";
import { useUser } from "@/context/UserContext";

export const PortfolioSummary = () => {
  const { currentUser } = useUser();
  
  return (
    <Card className="p-6 bg-card border border-border shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-foreground">Portfolio Summary</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Value</p>
              <p className="text-lg font-bold text-foreground">
                ₹{currentUser?.portfolioValue?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-success-light rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Today's Change</p>
              <p className="text-lg font-bold text-success">+₹18,240</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-success">+1.49%</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Invested</p>
            <p className="text-sm font-bold text-foreground">₹10,00,000</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Returns</p>
            <p className="text-sm font-bold text-success">+₹0</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
