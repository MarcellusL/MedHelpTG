import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface AnalysisResult {
  woundType: string;
  confidence: number;
  severity: string;
  recommendation: string;
}

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    const analyzeWound = async () => {
      const storedImage = sessionStorage.getItem('woundImage');
      const storedSymptoms = sessionStorage.getItem('symptoms');

      if (!storedImage || !storedSymptoms) {
        toast({
          title: "Missing data",
          description: "Please complete all steps",
          variant: "destructive",
        });
        navigate("/upload");
        return;
      }

      setImageData(storedImage);
      const symptoms = JSON.parse(storedSymptoms);

      try {
        // Call classification endpoint
        const { data: classificationData, error: classError } = await supabase.functions.invoke('classify-wound', {
          body: { image: storedImage }
        });

        if (classError) throw classError;

        // Call severity calculation endpoint
        const { data: severityData, error: sevError } = await supabase.functions.invoke('calculate-severity', {
          body: {
            woundLabel: classificationData.label,
            pain: symptoms.painLevel,
            bleeding: symptoms.bleeding,
            swelling: symptoms.swelling
          }
        });

        if (sevError) throw sevError;

        setResult({
          woundType: classificationData.label,
          confidence: classificationData.confidence,
          severity: severityData.severity,
          recommendation: severityData.recommendation
        });
      } catch (error) {
        console.error('Analysis error:', error);
        toast({
          title: "Analysis failed",
          description: "Unable to analyze wound. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    analyzeWound();
  }, [navigate, toast]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "SelfCare":
        return "bg-success text-success-foreground";
      case "UrgentCare":
        return "bg-warning text-warning-foreground";
      case "ER":
      case "TraumaCenter":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "SelfCare":
        return <CheckCircle className="h-5 w-5" />;
      case "UrgentCare":
        return <AlertTriangle className="h-5 w-5" />;
      case "ER":
      case "TraumaCenter":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing wound...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
          </Card>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Analysis Results
          </h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Image Preview */}
          {imageData && (
            <Card className="p-4 shadow-[var(--shadow-card)]">
              <img
                src={imageData}
                alt="Wound"
                className="max-h-64 mx-auto rounded-lg object-contain"
              />
            </Card>
          )}

          {/* Classification Results */}
          <Card className="p-6 shadow-[var(--shadow-elevated)]">
            <h2 className="text-xl font-bold mb-4">Classification</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Wound Type:</span>
                <Badge variant="secondary" className="text-base">
                  {result.woundType}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Confidence:</span>
                <span className="font-semibold">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          </Card>

          {/* Severity Assessment */}
          <Card className="p-6 shadow-[var(--shadow-elevated)] border-2 border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${getSeverityColor(result.severity)}`}>
                {getSeverityIcon(result.severity)}
              </div>
              <h2 className="text-xl font-bold text-foreground">Severity Assessment</h2>
            </div>
            <Badge className={`${getSeverityColor(result.severity)} text-lg px-4 py-2 mb-4`}>
              {result.severity.replace(/([A-Z])/g, ' $1').trim()}
            </Badge>
            <p className="text-foreground leading-relaxed">
              {result.recommendation}
            </p>
          </Card>

          {/* Action Button */}
          {result.severity !== "SelfCare" && (
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-primary-glow text-lg py-6"
              onClick={() => {
                sessionStorage.setItem('severityType', result.severity);
                navigate("/facility-map");
              }}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Find Nearest Facility
            </Button>
          )}

          {/* Disclaimer */}
          <Card className="p-4 bg-muted/50 border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Disclaimer:</strong> This is an AI-assisted assessment tool and should not replace professional medical advice. 
              If you have concerns about your wound or if symptoms worsen, please seek immediate medical attention.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;
