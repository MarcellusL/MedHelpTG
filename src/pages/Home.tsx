import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, MapPin, Activity, Shield } from "lucide-react";
import Header from "@/components/Header";
import { CometCard } from "@/components/ui/comet-card";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Activity className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              WoundTriage AI
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Smart wound assessment powered by AI. Get instant severity analysis and find the nearest appropriate healthcare facility.
          </p>
        </div>

        {/* Main CTA Card */}
        <Card className="max-w-2xl mx-auto p-8 md:p-12 shadow-[var(--shadow-elevated)] border-2 border-primary/20 bg-card/80 backdrop-blur-sm mb-8">
          <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center">
              <Camera className="h-10 w-10 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Start Wound Assessment</h2>
              <p className="text-muted-foreground">
                Upload an image of your wound and answer a few questions for instant triage guidance
              </p>
            </div>
            <Button 
              size="lg" 
              className="w-full md:w-auto text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
              onClick={() => navigate("/upload")}
            >
              Scan Wound Now
            </Button>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <CometCard>
            <Card className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border-border/50">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <Camera className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">AI Classification</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced ML model identifies wound types with high accuracy
                </p>
              </div>
            </Card>
          </CometCard>

          <CometCard>
            <Card className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border-border/50">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Shield className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg">Smart Triage</h3>
                <p className="text-sm text-muted-foreground">
                  Combines image analysis with symptoms for accurate severity assessment
                </p>
              </div>
            </Card>
          </CometCard>

          <CometCard>
            <Card className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border-border/50">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Find Care</h3>
                <p className="text-sm text-muted-foreground">
                  Locate nearest appropriate facility based on your location
                </p>
              </div>
            </Card>
          </CometCard>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="p-4 bg-muted/50 border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Medical Disclaimer:</strong> This tool provides guidance only and is not a substitute for professional medical advice. 
              In case of serious injury or emergency, call 911 immediately.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
