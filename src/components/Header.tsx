import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              NexaHealth
            </h1>
          </div>

          {/* Telegram Button */}
          <Button 
            variant="default"
            size="default"
            className="gap-2"
            onClick={() => window.open('https://t.me/your_bot_username', '_blank')}
          >
            <Send className="h-4 w-4" />
            Chat on Telegram
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
