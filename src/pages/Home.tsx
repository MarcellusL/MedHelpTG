import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Camera, MapPin, Sparkles, Shield, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { CometCard } from "@/components/ui/comet-card";
import heroBackground from "@/assets/healthcare-hero-bg.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [showImagePrompt, setShowImagePrompt] = useState(false);

  const medicalKeywords = [
    "skin irritation",
    "wounds on skin",
    "wound",
    "injury",
    "cut",
    "burn",
    "bruise",
    "laceration",
    "abrasion",
    "rash",
    "infection",
    "bleeding"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lowerPrompt = prompt.toLowerCase();
    const hasMedicalKeyword = medicalKeywords.some(keyword => 
      lowerPrompt.includes(keyword)
    );

    if (hasMedicalKeyword) {
      setShowImagePrompt(true);
      toast({
        title: "Medical Image Recommended",
        description: "For wound or skin-related queries, we recommend uploading an image for accurate assessment.",
      });
    } else {
      toast({
        title: "Language Learning Mode",
        description: `Processing: "${prompt}"`,
      });
      setPrompt("");
      setShowImagePrompt(false);
    }
  };

  const handleScanImage = () => {
    navigate("/upload");
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/50 to-background/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Header />
        <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              NexaLearn
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered language learning and medical assessment. Ask anything or scan wounds for instant analysis.
          </p>
        </div>

        {/* Main Language Prompt Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ask Me Anything</h2>
              <p className="text-muted-foreground text-base md:text-lg">
                Get instant help with language learning, translations, or medical assessments
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your question"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 h-14 text-base shadow-lg border-border/50 bg-background"
                />
                <Button 
                  type="submit"
                  size="icon"
                  className="bg-gradient-to-r from-primary to-primary-glow h-14 w-14 shadow-lg"
                  disabled={!prompt.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>

            {showImagePrompt && (
              <Card className="p-6 bg-primary/10 border-primary/20">
                <p className="text-sm text-foreground mb-4 text-center">
                  📸 For accurate medical assessment, please scan an image of the affected area
                </p>
                <Button
                  onClick={handleScanImage}
                  className="w-full bg-gradient-to-r from-primary to-primary-glow h-11"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Scan Image Now
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          <CometCard className="flex">
            <Card className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border-border/50 w-full">
              <div className="flex flex-col items-center text-center space-y-3 min-h-[200px]">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Camera className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Image Classification</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced AI analyzes wound images when you mention skin irritation or wounds
                </p>
              </div>
            </Card>
          </CometCard>

          <CometCard className="flex">
            <Card className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border-border/50 w-full">
              <div className="flex flex-col items-center text-center space-y-3 min-h-[200px]">
                <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg">Smart Triage</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized recommendations for urgent care, ER, or home treatment
                </p>
              </div>
            </Card>
          </CometCard>

          <CometCard className="flex">
            <Card className="p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border-border/50 w-full">
              <div className="flex flex-col items-center text-center space-y-3 min-h-[200px]">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Find Care</h3>
                <p className="text-sm text-muted-foreground">
                  Locate nearest appropriate facility based on your needs
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
    </div>
  );
};

export default Home;
