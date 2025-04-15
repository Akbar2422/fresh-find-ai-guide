
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface IdentificationProps {
  name: string;
  varieties: string;
}

const Identification = ({ name, varieties }: IdentificationProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-fresh">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold">Varieties:</span> {varieties || "Standard"}
        </p>
      </CardContent>
    </Card>
  );
};

export default Identification;
