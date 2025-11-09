import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, User } from "lucide-react";
// --- MODIFIED --- Import our new User Context hook instead of AuthContext
import { useUser } from "@/context/UserContext";

const Login = () => {
  // --- MODIFIED --- Renamed to 'uid' for clarity and removed password state
  const [uid, setUid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // --- MODIFIED --- Use our new login function from the UserContext
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    // Simulate authentication delay for a better user experience
    await new Promise(resolve => setTimeout(resolve, 1000));

    // --- MODIFIED --- Use the context's login function to validate the UID
    if (login(uid)) {
      // On success, navigate to the dashboard
      navigate("/dashboard");
    } else {
      // On failure, show an error message
      setError("Invalid UID. Please use User1@zerodha, user2@zerodha, or user3@zerodha.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0,_transparent_31px,_hsl(var(--primary)/0.1)_32px),_linear-gradient(90deg,_transparent_0,_transparent_31px,_hsl(var(--primary)/0.1)_32px)] bg-[length:32px_32px]" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-8 bg-card/80 backdrop-blur-md border border-border shadow-2xl">
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground text-glow-cyan mb-2">
              PortPay
            </h1>
            <p className="text-muted-foreground">
              Next-Gen Stock Payment Platform
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            {/* --- MODIFIED --- This is now the UID Field */}
            <div className="space-y-2">
              <Label htmlFor="uid" className="text-sm font-medium text-foreground">
                User ID
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="uid"
                  type="text"
                  placeholder="e.g., User1@zerodha"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* --- NEW --- Display login error message */}
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            {/* Login Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white hover:from-cyan-300 hover:via-blue-400 hover:to-purple-500 border-0 shadow-glow transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Login to Dashboard</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-muted-foreground">
              Secure access to your portfolio and trading tools
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;

