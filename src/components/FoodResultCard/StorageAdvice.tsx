
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefrigeratorIcon, Clock } from "lucide-react";

interface StorageAdviceProps {
  method: string;
  expiryDuration: string;
}

const StorageAdvice = ({ method, expiryDuration }: StorageAdviceProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <RefrigeratorIcon className="h-5 w-5 text-fresh" />
          <span>Storage Advice</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <span className="font-medium">Best Method:</span>{" "}
          <span className="text-muted-foreground">{method}</span>
        </div>
        <div className="text-sm flex items-center">
          <span className="font-medium mr-1">Shelf Life:</span>{" "}
          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">{expiryDuration}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageAdvice;
