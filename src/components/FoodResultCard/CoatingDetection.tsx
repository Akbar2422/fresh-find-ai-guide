
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface CoatingDetectionProps {
  signs: string;
  confidence: string;
}

const CoatingDetection = ({ signs, confidence }: CoatingDetectionProps) => {
  if (!signs) return null;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-berry" />
          <span>Artificial Coating Detection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">{signs}</p>
        <p className="text-xs text-muted-foreground">Confidence: {confidence}</p>
      </CardContent>
    </Card>
  );
};

export default CoatingDetection;
