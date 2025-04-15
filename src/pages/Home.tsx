
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, History, Award, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import ImageCapture from '@/components/ImageCapture';
import FoodResultCard from '@/components/FoodResultCard/FoodResultCard';
import { analyzeImage, type GeminiResponse, type GeminiError } from '@/lib/gemini';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GeminiResponse | GeminiError | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        navigate('/auth');
        return;
      }
      
      if (data?.user) {
        setUser(data.user);
      } else {
        navigate('/auth');
      }
      
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  const handleImageCaptured = async (imageFile: File) => {
    setCapturedImage(imageFile);
    setAnalysisResult(null);
    setImageUrl(URL.createObjectURL(imageFile));
    
    // Start analyzing the image
    setAnalyzing(true);
    try {
      const result = await analyzeImage(imageFile);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
      });
      setAnalysisResult({ error: "Failed to analyze image. Please try again." });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleSaveToHistory = async () => {
    if (!capturedImage || !analysisResult || 'error' in analysisResult || !user?.id || !imageUrl) {
      return;
    }
    
    try {
      // 1. Upload the image to Supabase Storage
      const timestamp = new Date().getTime();
      const filePath = `${user.id}/${timestamp}_${capturedImage.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, capturedImage);
      
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
          item_name: analysisResult.Identification.name,
          status: analysisResult.QualityCheck.rate,
          varieties: analysisResult.Identification.varieties,
          quality_reason: analysisResult.QualityCheck.reason,
          nutrition_details: analysisResult.NutritionInfo,
          recipes: analysisResult.RecipeSuggestions,
          storage_advice: analysisResult.StorageAdvice.method,
          expiry_duration: analysisResult.StorageAdvice.expiry_duration,
          fun_fact: analysisResult.FunFact,
          artificial_coating: analysisResult.ArtificialCoatingDetection,
          date: new Date().toISOString(),
        });
      
      if (insertError) throw insertError;
      
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
    setCapturedImage(null);
    setAnalysisResult(null);
    setImageUrl(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-fresh"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-fresh flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-white"
              >
                <path d="M5 22h14" />
                <path d="M5 2h14" />
                <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-fresh">FreshCheck</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/history')}
            >
              <History className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/leaderboard')}
            >
              <Award className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {analysisResult ? (
          <>
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={handleNewScan}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Scan
            </Button>
            
            <FoodResultCard 
              result={analysisResult} 
              loading={analyzing}
              imageUrl={imageUrl || ''}
              onSaveToHistory={handleSaveToHistory}
            />
          </>
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Scan Fresh Produce</h2>
              <p className="text-gray-600">
                Take a photo or upload an image of any fruit or vegetable to check freshness,
                get nutrition info, and recipe ideas.
              </p>
            </div>
            
            <ImageCapture onImageCaptured={handleImageCaptured} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
