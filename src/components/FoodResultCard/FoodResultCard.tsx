
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Share2 } from 'lucide-react';
import { GeminiResponse, GeminiError } from '@/types/gemini';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

import Identification from './Identification';
import QualityCheck from './QualityCheck';
import NutritionInfo from './NutritionInfo';
import RecipeSuggestions from './RecipeSuggestions';
import StorageAdvice from './StorageAdvice';
import FridgeReminder from './FridgeReminder';
import FunFact from './FunFact';
import CoatingDetection from './CoatingDetection';

interface FoodResultCardProps {
  result: GeminiResponse | GeminiError;
  loading: boolean;
  imageUrl: string;
  onSaveToHistory: () => void;
}

const FoodResultCard = ({ 
  result, 
  loading, 
  imageUrl,
  onSaveToHistory 
}: FoodResultCardProps) => {
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  
  if (loading) {
    return (
      <Card className="w-full shadow-card mt-6">
        <CardContent className="p-6 flex flex-col items-center justify-center h-64">
          <Loader2 className="h-10 w-10 text-fresh animate-spin mb-4" />
          <p className="text-lg font-medium">Analyzing your food...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
        </CardContent>
      </Card>
    );
  }
  
  // Check if result has an error property
  if ('error' in result) {
    return (
      <Card className="w-full shadow-card mt-6">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-destructive"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="m6 6 12 12" />
                <path d="m6 18 12-12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Analysis Failed</h3>
            <p className="text-sm text-muted-foreground mt-2">{result.error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const handleSaveResult = async () => {
    try {
      setSaved(true);
      onSaveToHistory();
      toast({
        title: "Results saved!",
        description: "You can find this in your history.",
      });
    } catch (error: any) {
      console.error('Error saving result:', error);
      toast({
        variant: "destructive",
        title: "Failed to save",
        description: error.message || "An error occurred while saving the result.",
      });
    }
  };
  
  const handleShareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: `FreshCheck: ${result.Identification.name}`,
        text: `Check out my ${result.Identification.name} analysis with FreshCheck! Quality: ${result.QualityCheck.rate}`,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the Web Share API.",
      });
    }
  };
  
  return (
    <Card className="w-full shadow-card mt-6">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl">Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="p-4 lg:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Identification 
            name={result.Identification.name} 
            varieties={result.Identification.varieties} 
          />
          
          <QualityCheck 
            rate={result.QualityCheck.rate} 
            reason={result.QualityCheck.reason} 
          />
        </div>
        
        <NutritionInfo 
          calories={result.NutritionInfo.calories}
          protein={result.NutritionInfo.protein}
          carbohydrates={result.NutritionInfo.carbohydrates}
          fats={result.NutritionInfo.fats}
          fiber={result.NutritionInfo.fiber}
          waterContent={result.NutritionInfo.waterContent}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StorageAdvice 
            method={result.StorageAdvice.method} 
            expiryDuration={result.StorageAdvice.expiry_duration} 
          />
          
          <FridgeReminder 
            reminder={result.FridgeReminder}
            itemName={result.Identification.name}
            expiryDuration={result.StorageAdvice.expiry_duration}
          />
        </div>
        
        <RecipeSuggestions recipes={result.RecipeSuggestions} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FunFact fact={result.FunFact} />
          
          <CoatingDetection 
            signs={result.ArtificialCoatingDetection.signs} 
            confidence={result.ArtificialCoatingDetection.confidence} 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button
            className="flex-1 bg-fresh hover:bg-fresh-dark"
            onClick={handleSaveResult}
            disabled={saved}
          >
            <Save className="mr-2 h-4 w-4" />
            {saved ? 'Saved to History' : 'Save to History'}
          </Button>
          
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleShareResult}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodResultCard;
