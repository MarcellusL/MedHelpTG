import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-7 w-7 text-primary" />
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">
              NexaHealth
            </h1>
          </div>

          {/* Telegram Button */}
          <Button 
            variant="outline"
            size="sm"
            className="gap-2 border-border hover:bg-accent"
            onClick={() => window.open('https://t.me/your_bot_username', '_blank')}
          >
            <Send className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chat on Telegram</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
