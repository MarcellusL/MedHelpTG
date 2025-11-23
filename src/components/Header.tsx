import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigate("/")}
          >
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              NexaHealth
            </h1>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Telegram Button */}
            <Button 
              variant="default"
              size="default"
              className="gap-2"
              onClick={() => window.open('#', '_blank')}
            >
              <Send className="h-4 w-4" />
              Chat on Telegram
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
