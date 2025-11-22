import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Symptoms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [painLevel, setPainLevel] = useState(5);
  const [bleeding, setBleeding] = useState<string>("none");
  const [swelling, setSwelling] = useState<string>("no");

  const handleSubmit = async () => {
    const imageData = sessionStorage.getItem('woundImage');
    
    if (!imageData) {
      toast({
        title: "No image found",
        description: "Please upload an image first",
        variant: "destructive",
      });
      navigate("/upload");
      return;
    }

    // Store symptom data
    sessionStorage.setItem('symptoms', JSON.stringify({
      painLevel,
      bleeding,
      swelling: swelling === "yes"
    }));

    // Navigate to results
    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/upload")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Upload
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Symptom Assessment
          </h1>
          <p className="text-muted-foreground">
            Answer these questions to help determine severity
          </p>
        </div>

        {/* Symptoms Card */}
        <Card className="max-w-2xl mx-auto p-8 shadow-[var(--shadow-elevated)]">
          <div className="space-y-8">
            {/* Pain Level */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">
                  Pain Level
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Rate your pain from 0 (no pain) to 10 (worst pain)
                </p>
              </div>
              <div className="space-y-4">
                <Slider
                  value={[painLevel]}
                  onValueChange={(value) => setPainLevel(value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">No pain</span>
                  <span className="text-2xl font-bold text-primary">{painLevel}</span>
                  <span className="text-muted-foreground">Severe</span>
                </div>
              </div>
            </div>

            {/* Bleeding */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">
                  Bleeding Level
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Is the wound currently bleeding?
                </p>
              </div>
              <RadioGroup value={bleeding} onValueChange={setBleeding}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="flex-1 cursor-pointer">
                    <div className="font-medium">No bleeding</div>
                    <div className="text-sm text-muted-foreground">Wound is not bleeding</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="mild" id="mild" />
                  <Label htmlFor="mild" className="flex-1 cursor-pointer">
                    <div className="font-medium">Mild bleeding</div>
                    <div className="text-sm text-muted-foreground">Minor oozing or spotting</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="heavy" id="heavy" />
                  <Label htmlFor="heavy" className="flex-1 cursor-pointer">
                    <div className="font-medium">Heavy bleeding</div>
                    <div className="text-sm text-muted-foreground">Continuous or significant blood flow</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Swelling */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold">
                  Swelling
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Is there noticeable swelling around the wound?
                </p>
              </div>
              <RadioGroup value={swelling} onValueChange={setSwelling}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="flex-1 cursor-pointer font-medium">
                    No swelling
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="flex-1 cursor-pointer font-medium">
                    Yes, there is swelling
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Warning */}
            <Card className="p-4 bg-warning/10 border-warning/20">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning-foreground mb-1">Important</p>
                  <p className="text-muted-foreground">
                    If you're experiencing severe bleeding, difficulty breathing, or signs of shock, call 911 immediately.
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/upload")}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
                onClick={handleSubmit}
              >
                Analyze Wound
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Symptoms;
