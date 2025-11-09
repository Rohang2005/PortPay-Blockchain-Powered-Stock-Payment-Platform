import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StockCardProps {
  symbol: string;
  name: string;
  currentValue: number;
  changePercent: number;
  changeValue: number;
  shares: number;
}

// Mock sparkline data for demonstration
const generateSparkline = (isPositive: boolean) => {
  const points = 20;
  const data = [];
  let base = 50;
  
  for (let i = 0; i < points; i++) {
    const variation = (Math.random() - 0.5) * 20;
    const trend = isPositive ? i * 2 : -i * 1.5;
    base += variation + trend;
    data.push(Math.max(10, Math.min(90, base)));
  }
  
  return data;
};

export const StockCard = ({
  symbol,
  name,
  currentValue,
  changePercent,
  changeValue,
  shares,
}: StockCardProps) => {
  const isPositive = changePercent >= 0;
  const sparklineData = generateSparkline(isPositive);
  const sparklinePath = sparklineData.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${(index / (sparklineData.length - 1)) * 100} ${100 - point}`
  ).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`cyber-card p-5 cursor-pointer group relative overflow-hidden ${
        isPositive ? 'pulse-gain' : 'pulse-loss'
      }`}>
      {/* Glowing border effect */}
      <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        isPositive 
          ? 'bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-blue-500/20' 
          : 'bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20'
      }`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-foreground">{symbol}</h3>
            <p className="text-xs text-muted-foreground">{name}</p>
          </div>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
              isPositive 
                ? "bg-success-light/30 text-success border-success/30" 
                : "bg-destructive-light/30 text-destructive border-destructive/30"
            }`}
          >
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-semibold">{Math.abs(changePercent).toFixed(2)}%</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">₹{currentValue.toLocaleString()}</span>
            <span className={`text-sm font-medium ${isPositive ? "text-success" : "text-destructive"}`}>
              {isPositive ? "+" : ""}₹{changeValue.toFixed(2)}
            </span>
          </div>
          
          {/* Sparkline Chart */}
          <div className="h-12 w-full relative">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`gradient-${symbol}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isPositive ? "#00FF9C" : "#FF0080"} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={isPositive ? "#00FFFF" : "#FF00FF"} stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path
                d={sparklinePath}
                fill="none"
                stroke={`url(#gradient-${symbol})`}
                strokeWidth="2"
                className="drop-shadow-lg"
                style={{
                  filter: `drop-shadow(0 0 4px ${isPositive ? '#00FF9C' : '#FF0080'})`
                }}
              />
              {/* Fill area under the line */}
              <path
                d={`${sparklinePath} L 100 100 L 0 100 Z`}
                fill={`url(#gradient-${symbol})`}
                opacity="0.1"
              />
            </svg>
          </div>
          
          <p className="text-xs text-muted-foreground">{shares} shares</p>
        </div>
      </div>
    </Card>
    </motion.div>
  );
};
