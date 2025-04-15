
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface QualityCheckProps {
  rate: 'Good' | 'Average' | 'Bad';
  reason: string;
}

const QualityCheck = ({ rate, reason }: QualityCheckProps) => {
  const getQualityIcon = () => {
    switch (rate) {
      case 'Good':
        return <CheckCircle className="h-6 w-6 text-fresh" />;
      case 'Average':
        return <AlertTriangle className="h-6 w-6 text-ripe" />;
      case 'Bad':
        return <XCircle className="h-6 w-6 text-apple" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-ripe" />;
    }
  };

  const getQualityColor = () => {
    switch (rate) {
      case 'Good':
        return 'text-fresh';
      case 'Average':
        return 'text-ripe';
      case 'Bad':
        return 'text-apple';
      default:
        return 'text-ripe';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          {getQualityIcon()}
          <span className={getQualityColor()}>Quality: {rate}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{reason}</p>
      </CardContent>
    </Card>
  );
};

export default QualityCheck;
