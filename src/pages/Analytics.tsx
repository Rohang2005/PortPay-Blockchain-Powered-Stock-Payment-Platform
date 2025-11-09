import { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Zap,
  MessageCircle
} from "lucide-react";

// Mock data for analytics
const portfolioData = [
  { symbol: "MSFT", name: "Reliance Industries", value: 125000, change: 5.2, changeAmount: 6200 },
  { symbol: "AAPL", name: "Tata Consultancy", value: 95000, change: -2.1, changeAmount: -1995 },
  { symbol: "INFY", name: "Infosys Limited", value: 180000, change: 8.7, changeAmount: 15660 },
  { symbol: "HDB", name: "HDFC Bank", value: 75000, change: 3.4, changeAmount: 2550 },
  { symbol: "IBN", name: "ICICI Bank", value: 110000, change: -1.8, changeAmount: -1980 },
  { symbol: "WIT", name: "Wipro Limited", value: 135000, change: 12.3, changeAmount: 16605 },
];

const monthlyData = [
  { month: "Jan", sent: 45000, received: 65000, net: 20000 },
  { month: "Feb", sent: 52000, received: 72000, net: 20000 },
  { month: "Mar", sent: 48000, received: 68000, net: 20000 },
  { month: "Apr", sent: 61000, received: 85000, net: 24000 },
  { month: "May", sent: 55000, received: 78000, net: 23000 },
  { month: "Jun", sent: 67000, received: 92000, net: 25000 },
];

const categoryData = [
  { category: "Business", amount: 125000, percentage: 35, color: "#00FFFF" },
  { category: "Personal", amount: 95000, percentage: 27, color: "#8A2BE2" },
  { category: "Shopping", amount: 65000, percentage: 18, color: "#00FF9C" },
  { category: "Entertainment", amount: 45000, percentage: 13, color: "#FF00FF" },
  { category: "Other", amount: 25000, percentage: 7, color: "#1E90FF" },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("6m");

  const totalPortfolioValue = portfolioData.reduce((sum, stock) => sum + stock.value, 0);
  const totalGain = portfolioData.reduce((sum, stock) => sum + stock.changeAmount, 0);
  const totalGainPercentage = (totalGain / (totalPortfolioValue - totalGain)) * 100;

  return (
    <div className="min-h-screen transition-all duration-300">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground mt-1">Deep insights into your portfolio and transaction patterns</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Month</SelectItem>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:from-purple-400 hover:via-pink-400 hover:to-red-400 border-0 shadow-glow">
                <Target className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card border border-border shadow-lg cyber-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Value</p>
                  <p className="text-2xl font-bold text-foreground">₹{totalPortfolioValue.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm text-success font-medium">+{totalGainPercentage.toFixed(2)}%</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border shadow-lg cyber-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Gain</p>
                  <p className={`text-2xl font-bold ${totalGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                    ₹{totalGain.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {totalGain >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-success" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                    <span className={`text-sm font-medium ${totalGain >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {totalGain >= 0 ? 'Profit' : 'Loss'}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${totalGain >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <Activity className={`w-6 h-6 ${totalGain >= 0 ? 'text-success' : 'text-destructive'}`} />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border shadow-lg cyber-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Stocks</p>
                  <p className="text-2xl font-bold text-foreground">{portfolioData.length}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-sm text-accent font-medium">Live Trading</span>
                  </div>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border border-border shadow-lg cyber-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Performer</p>
                  <p className="text-2xl font-bold text-success">WIPRO</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-sm text-success font-medium">+12.3%</span>
                  </div>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <Target className="w-6 h-6 text-success" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Performance Chart */}
            <Card className="p-6 bg-card border border-border shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Portfolio Performance</h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Net Value</span>
                </div>
              </div>
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00FF9C" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 40}
                      x2="400"
                      y2={i * 40}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  ))}
                  {/* Chart line */}
                  <path
                    d="M 0,160 L 80,140 L 160,120 L 240,100 L 320,80 L 400,60"
                    fill="none"
                    stroke="url(#portfolioGradient)"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                    style={{ filter: 'drop-shadow(0 0 6px #00FF9C)' }}
                  />
                  {/* Fill area */}
                  <path
                    d="M 0,160 L 80,140 L 160,120 L 240,100 L 320,80 L 400,60 L 400,200 L 0,200 Z"
                    fill="url(#portfolioGradient)"
                    opacity="0.1"
                  />
                </svg>
              </div>
            </Card>

            {/* Category Distribution */}
            <Card className="p-6 bg-card border border-border shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Transaction Categories</h3>
                <PieChart className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">₹{item.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Stock Performance Table */}
          <Card className="bg-card border border-border shadow-lg">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Stock Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Value</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Change</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.map((stock, index) => (
                    <tr key={index} className="border-b border-border hover:bg-secondary/20 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-foreground">{stock.symbol}</p>
                          <p className="text-xs text-muted-foreground">{stock.name}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">₹{stock.value.toLocaleString()}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {stock.change >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-success" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          )}
                          <span className={`font-medium ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              stock.change >= 0 ? 'bg-success' : 'bg-destructive'
                            }`}
                            style={{ width: `${Math.min(100, Math.abs(stock.change) * 10)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Chatbot Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/30 flex items-center justify-center text-white hover:shadow-cyan-500/50 transition-all duration-300"
            title="Chatbot Assistant"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;
