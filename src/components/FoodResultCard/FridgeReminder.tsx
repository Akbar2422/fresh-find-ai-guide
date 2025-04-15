
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface FridgeReminderProps {
  reminder: string;
  itemName: string;
  expiryDuration: string;
  onSaveToFridge?: () => void;
}

const FridgeReminder = ({ 
  reminder, 
  itemName, 
  expiryDuration,
  onSaveToFridge 
}: FridgeReminderProps) => {
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleSaveToFridge = () => {
    setSaved(true);
    toast({
      title: "Added to Fridge Tracker",
      description: `We'll remind you before your ${itemName} expires!`,
    });
    if (onSaveToFridge) {
      onSaveToFridge();
    }
  };

  if (!reminder) return null;
  
  return (
    <Card className="shadow-sm bg-gray-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-fresh" />
          <span>Fridge Reminder</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{reminder}</p>
        {!saved ? (
          <Button 
            className="w-full bg-fresh hover:bg-fresh-dark"
            onClick={handleSaveToFridge}
          >
            Save to Fridge Tracker
          </Button>
        ) : (
          <div className="text-sm text-center py-2 bg-fresh/10 text-fresh rounded-md">
            Added to your fridge tracker!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FridgeReminder;
