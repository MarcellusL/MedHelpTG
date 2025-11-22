import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, MapPin, Sparkles, Shield } from "lucide-react";
import Header from "@/components/Header";
import { CometCard } from "@/components/ui/comet-card";
import heroBackground from "@/assets/healthcare-hero-bg.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Smart Wound Assessment Powered by AI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Get instant severity analysis and find the nearest appropriate healthcare facility in minutes.
          </p>
        </div>

        {/* Main CTA */}
        <div className="max-w-2xl mx-auto mb-20">
          <Card className="p-8 md:p-10 shadow-[var(--shadow-elevated)] border border-border">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-foreground">Start Your Assessment</h2>
                <p className="text-muted-foreground text-base">
                  Upload an image of your wound and answer a few questions for instant triage guidance
                </p>
              </div>
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 h-12 text-base font-medium"
                onClick={() => navigate("/upload")}
              >
                Begin Assessment
              </Button>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <Card className="p-8 border border-border hover:shadow-[var(--shadow-card)] transition-shadow">
            <div className="flex flex-col items-start space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground">AI Classification</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced ML model identifies wound types with high accuracy
              </p>
            </div>
          </Card>

          <Card className="p-8 border border-border hover:shadow-[var(--shadow-card)] transition-shadow">
            <div className="flex flex-col items-start space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground">Smart Triage</h3>
              <p className="text-muted-foreground leading-relaxed">
                Combines image analysis with symptoms for accurate severity assessment
              </p>
            </div>
          </Card>

          <Card className="p-8 border border-border hover:shadow-[var(--shadow-card)] transition-shadow">
            <div className="flex flex-col items-start space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl text-foreground">Find Care</h3>
              <p className="text-muted-foreground leading-relaxed">
                Locate nearest appropriate facility based on your location
              </p>
            </div>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-5 bg-muted border-border">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              <strong className="text-foreground font-medium">Medical Disclaimer:</strong> This tool provides guidance only and is not a substitute for professional medical advice. 
              In case of serious injury or emergency, call 911 immediately.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
