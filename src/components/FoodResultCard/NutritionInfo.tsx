
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface NutritionInfoProps {
  calories: string;
  protein: string;
  carbohydrates: string;
  fats: string;
  fiber: string;
  waterContent: string;
}

const NutritionInfo = ({
  calories,
  protein,
  carbohydrates,
  fats,
  fiber,
  waterContent,
}: NutritionInfoProps) => {
  const nutritionItems = [
    { label: "Calories", value: calories },
    { label: "Protein", value: protein },
    { label: "Carbohydrates", value: carbohydrates },
    { label: "Fats", value: fats },
    { label: "Fiber", value: fiber },
    { label: "Water Content", value: waterContent },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Activity className="h-5 w-5 text-berry" />
          <span>Nutrition Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {nutritionItems.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="font-medium">{item.label}:</span>
              <span className="text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionInfo;
