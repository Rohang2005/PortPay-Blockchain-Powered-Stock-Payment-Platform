import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ContactCardProps {
  name: string;
  initials: string;
  lastInteraction?: string;
}

export const ContactCard = ({ name, initials, lastInteraction }: ContactCardProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-card rounded-lg border border-border hover:shadow-md transition-all duration-200">
      <Avatar className="h-16 w-16 mb-3 border-2 border-primary">
        <AvatarFallback className="bg-accent text-accent-foreground font-semibold text-lg">
          {initials}
        </AvatarFallback>
      </Avatar>
      <h4 className="font-semibold text-foreground text-center mb-1">{name}</h4>
      {lastInteraction && (
        <p className="text-xs text-muted-foreground mb-3">{lastInteraction}</p>
      )}
      <Button size="sm" variant="outline" className="w-full gap-2">
        <Send className="w-3 h-3" />
        Pay
      </Button>
    </div>
  );
};
