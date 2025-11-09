import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const SETTINGS_KEY = "portpay.settings";

type Settings = {
  paymentLimit: number;
  darkMode: boolean;
  currency: "INR" | "USD" | "EUR";
};

const defaultSettings: Settings = {
  paymentLimit: 50000,
  darkMode: true,
  currency: "INR",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Settings;
        setSettings({ ...defaultSettings, ...parsed });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    // Apply theme
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings]);

  return (
    <div className="min-h-screen transition-all duration-300">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>

          <Card className="p-6 space-y-6 bg-card border border-border shadow-lg">
            <div className="space-y-2">
              <Label htmlFor="paymentLimit">Payment limit</Label>
              <Input
                id="paymentLimit"
                type="number"
                min={0}
                value={settings.paymentLimit}
                onChange={(e) => setSettings((s) => ({ ...s, paymentLimit: Number(e.target.value) }))}
              />
              <p className="text-xs text-muted-foreground">Maximum single payment amount.</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="darkMode">Dark mode</Label>
                <p className="text-xs text-muted-foreground">Toggle the application theme.</p>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, darkMode: v }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Default currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(v: Settings["currency"]) => setSettings((s) => ({ ...s, currency: v }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}


