
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import FoodResultCard from '@/components/FoodResultCard/FoodResultCard';
import { GeminiResponse, GeminiError } from '@/types/gemini';

interface ImageResultProps {
  result: GeminiResponse | GeminiError | null;
  loading: boolean;
  imageUrl: string | null;
  onSaveToHistory: () => Promise<void>;
  onNewScan: () => void;
}

const ImageResult = ({ 
  result, 
  loading, 
  imageUrl, 
  onSaveToHistory, 
  onNewScan 
}: ImageResultProps) => {
  if (!result) return null;
  
  return (
    <>
      <Button 
        variant="outline" 
        className="mb-4"
        onClick={onNewScan}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Scan
      </Button>
      
      <FoodResultCard 
        result={result} 
        loading={loading}
        imageUrl={imageUrl || ''}
        onSaveToHistory={onSaveToHistory}
      />
    </>
  );
};

export default ImageResult;
