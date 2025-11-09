import { ArrowDownLeft, ArrowUpRight, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface TransactionCardProps {
  name: string;
  type: "sent" | "received";
  amount: number;
  timestamp: string;
  initials: string;
}

export const TransactionCard = ({ name, type, amount, timestamp, initials }: TransactionCardProps) => {
  const isSent = type === "sent";

  return (
    <motion.div 
      className="group flex items-center gap-4 p-4 hover:bg-secondary/30 rounded-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ 
        x: 4,
        transition: { duration: 0.2 }
      }}
    >
      {/* Glowing background effect */}
      <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        isSent 
          ? 'bg-gradient-to-r from-red-500/10 via-pink-500/10 to-purple-500/10' 
          : 'bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-blue-500/10'
      }`} />
      
      {/* Glowing avatar */}
      <div className="relative">
        <Avatar className="h-12 w-12 border-2 border-border group-hover:border-primary/50 transition-all duration-300">
          <AvatarFallback className={`font-semibold text-sm ${
            isSent 
              ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white' 
              : 'bg-gradient-to-br from-green-500 to-cyan-500 text-white'
          }`}>
            {initials}
          </AvatarFallback>
        </Avatar>
        {/* Glow effect around avatar */}
        <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isSent ? 'shadow-glow-red' : 'shadow-glow-green'
        }`} style={{
          boxShadow: isSent 
            ? '0 0 20px rgba(255, 0, 128, 0.4)' 
            : '0 0 20px rgba(0, 255, 156, 0.4)'
        }} />
      </div>

      <div className="flex-1 relative z-10">
        <h4 className="font-semibold text-foreground transition-all duration-300">{name}</h4>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>

      <div className="text-right flex items-center gap-3 relative z-10">
        <div className="text-right">
          <p className={`font-bold text-lg ${
            isSent 
              ? "text-destructive" 
              : "text-success"
          }`}>
            {isSent ? "-" : "+"}₹{amount.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 justify-end">
            <Zap className={`w-3 h-3 ${isSent ? 'text-destructive' : 'text-success'}`} />
            <p className="text-xs text-muted-foreground capitalize font-medium">{type}</p>
          </div>
        </div>
        <div className={`p-2 rounded-lg border transition-all duration-300 ${
          isSent 
            ? 'border-destructive/30 bg-destructive/10 group-hover:bg-destructive/20' 
            : 'border-success/30 bg-success/10 group-hover:bg-success/20'
        }`}>
          {isSent ? (
            <ArrowUpRight className="w-5 h-5 text-destructive" />
          ) : (
            <ArrowDownLeft className="w-5 h-5 text-success" />
          )}
        </div>
      </div>
    </motion.div>
  );
};
