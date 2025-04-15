
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface FunFactProps {
  fact: string;
}

const FunFact = ({ fact }: FunFactProps) => {
  if (!fact) return null;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-ripe" />
          <span>Fun Fact</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm italic">{fact}</p>
      </CardContent>
    </Card>
  );
};

export default FunFact;
