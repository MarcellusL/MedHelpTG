import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, MapPin, Activity, Shield, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { CometCard } from "@/components/ui/comet-card";
import heroBackground from "@/assets/hero-background.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-12 md:py-20">
          {/* Header */}
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Activity className="h-16 w-16 text-primary" />
                <div className="absolute inset-0 h-16 w-16 text-primary animate-pulse opacity-50" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
              WoundTriage AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
              Smart wound assessment powered by artificial intelligence. Get instant severity analysis and find the nearest appropriate healthcare facility.
            </p>
          </div>

          {/* Main CTA Card */}
          <Card className="max-w-3xl mx-auto p-10 md:p-14 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-md mb-16">
            <div className="text-center space-y-8">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-lg">
                <Camera className="h-12 w-12 text-primary-foreground" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Start Wound Assessment</h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
                  Upload an image of your wound and answer a few questions for instant triage guidance and facility recommendations
                </p>
              </div>
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-all hover:scale-105 shadow-lg"
                onClick={() => navigate("/upload")}
              >
                Begin Assessment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <CometCard>
              <Card className="p-8 shadow-xl hover:shadow-2xl transition-all border border-border/50 bg-card/95 backdrop-blur-sm h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl">AI Classification</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Advanced machine learning model identifies wound types with high accuracy using computer vision
                  </p>
                </div>
              </Card>
            </CometCard>

            <CometCard>
              <Card className="p-8 shadow-xl hover:shadow-2xl transition-all border border-border/50 bg-card/95 backdrop-blur-sm h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl flex items-center justify-center">
                    <Shield className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-xl">Smart Triage</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Combines image analysis with symptom data for accurate severity assessment and recommendations
                  </p>
                </div>
              </Card>
            </CometCard>

            <CometCard>
              <Card className="p-8 shadow-xl hover:shadow-2xl transition-all border border-border/50 bg-card/95 backdrop-blur-sm h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl">Find Care</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Locate the nearest appropriate healthcare facility based on severity and your location
                  </p>
                </div>
              </Card>
            </CometCard>
          </div>

          {/* Disclaimer */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 bg-muted/80 backdrop-blur-sm border-border/50">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                <strong className="text-foreground">Medical Disclaimer:</strong> This tool provides guidance only and is not a substitute for professional medical advice, diagnosis, or treatment. In case of serious injury or emergency, call 911 immediately.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
