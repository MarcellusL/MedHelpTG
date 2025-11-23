import { Sparkles, Home, Upload, Stethoscope, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLink } from "@/components/NavLink";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo/Brand */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" 
            onClick={() => navigate("/")}
          >
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              NexaHealth
            </h1>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6 flex-1">
            <NavLink 
              to="/" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </NavLink>
            <NavLink 
              to="/upload" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </NavLink>
            <NavLink 
              to="/symptoms" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary"
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Assessment
            </NavLink>
            <NavLink 
              to="/facility-map" 
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-primary"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Find Care
            </NavLink>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            
            {/* Telegram Button - Hidden on small screens */}
            <Button 
              variant="default"
              size="default"
              className="gap-2 hidden sm:flex"
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
