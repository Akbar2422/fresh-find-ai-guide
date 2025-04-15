
import { Skeleton } from '@/components/ui/skeleton';
import ImageCapture from '@/components/ImageCapture';
import Header from '@/components/Header';
import ImageResult from '@/components/ImageResult';
import { useAuth } from '@/hooks/useAuth';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';

const Home = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const { 
    capturedImage,
    imageUrl,
    analyzing,
    analysisResult,
    handleImageCaptured,
    handleSaveToHistory,
    handleNewScan
  } = useImageAnalysis(user);

  // Show global loading state during authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-fresh"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogout={logout} />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        {analysisResult ? (
          <ImageResult 
            result={analysisResult}
            loading={analyzing}
            imageUrl={imageUrl}
            onSaveToHistory={handleSaveToHistory}
            onNewScan={handleNewScan}
          />
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
