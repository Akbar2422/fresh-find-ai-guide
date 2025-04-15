
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { analyzeImage } from '@/lib/gemini';
import { GeminiResponse, GeminiError } from '@/types/gemini';
import { useToast } from '@/hooks/use-toast';

interface ImageAnalysisState {
  capturedImage: File | null;
  imageUrl: string | null;
  analyzing: boolean;
  analysisResult: GeminiResponse | GeminiError | null;
  saved: boolean;
}

export const useImageAnalysis = (user: any | null) => {
  const { toast } = useToast();
  const [state, setState] = useState<ImageAnalysisState>({
    capturedImage: null,
    imageUrl: null,
    analyzing: false,
    analysisResult: null,
    saved: false
  });

  const handleImageCaptured = async (imageFile: File) => {
    // Reset state
    setState({
      capturedImage: imageFile,
      imageUrl: URL.createObjectURL(imageFile),
      analyzing: true,
      analysisResult: null,
      saved: false
    });
    
    try {
      const result = await analyzeImage(imageFile);
      setState(prev => ({
        ...prev,
        analyzing: false,
        analysisResult: result
      }));
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
      });
      setState(prev => ({
        ...prev,
        analyzing: false,
        analysisResult: { error: "Failed to analyze image. Please try again." }
      }));
    }
  };

  const handleSaveToHistory = async () => {
    if (!state.capturedImage || !state.analysisResult || 'error' in state.analysisResult || !user?.id || !state.imageUrl) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Missing data required to save.",
      });
      return;
    }
    
    try {
      // 1. Upload the image to Supabase Storage
      const timestamp = new Date().getTime();
      const filePath = `${user.id}/${timestamp}_${state.capturedImage.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, state.capturedImage);
      
      if (uploadError) throw uploadError;
      
      // 2. Get the public URL for the uploaded image
      const { data: urlData } = await supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      const publicImageUrl = urlData.publicUrl;
      
      // 3. Save the analysis result to the history table
      const { error: insertError } = await supabase
        .from('history')
        .insert({
          user_id: user.id,
          image_url: publicImageUrl,
          item_name: state.analysisResult.Identification.name,
          status: state.analysisResult.QualityCheck.rate,
          varieties: state.analysisResult.Identification.varieties,
          quality_reason: state.analysisResult.QualityCheck.reason,
          nutrition_details: state.analysisResult.NutritionInfo,
          recipes: state.analysisResult.RecipeSuggestions,
          storage_advice: state.analysisResult.StorageAdvice.method,
          expiry_duration: state.analysisResult.StorageAdvice.expiry_duration,
          fun_fact: state.analysisResult.FunFact,
          artificial_coating: state.analysisResult.ArtificialCoatingDetection,
          date: new Date().toISOString(),
        });
      
      if (insertError) throw insertError;
      
      setState(prev => ({ ...prev, saved: true }));
      
      toast({
        title: "Results saved!",
        description: "You can find this in your history.",
      });
    } catch (error: any) {
      console.error('Error saving to history:', error);
      toast({
        variant: "destructive",
        title: "Failed to save to history",
        description: error.message || "An error occurred while saving to history.",
      });
    }
  };

  const handleNewScan = () => {
    setState({
      capturedImage: null,
      imageUrl: null,
      analyzing: false,
      analysisResult: null,
      saved: false
    });
  };

  return {
    capturedImage: state.capturedImage,
    imageUrl: state.imageUrl,
    analyzing: state.analyzing,
    analysisResult: state.analysisResult,
    saved: state.saved,
    handleImageCaptured,
    handleSaveToHistory,
    handleNewScan
  };
};
