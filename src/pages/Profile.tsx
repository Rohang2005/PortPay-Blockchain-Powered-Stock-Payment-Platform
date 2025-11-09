import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function ProfilePage() {
  return (
    <div className="min-h-screen transition-all duration-300">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>

          <Card className="p-6 space-y-6 bg-card border border-border shadow-lg">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback>DW</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">David Williams</p>
                <p className="text-xs text-muted-foreground">Signed in as <span className="font-medium text-primary">david</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" placeholder="First name" value="David" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" placeholder="Last name" value="Williams" disabled />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value="david.williams@example.com" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="username" value="david" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Phone" value="+1 555-123-4567" disabled />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}


