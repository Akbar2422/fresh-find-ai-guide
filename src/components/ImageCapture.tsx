
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ImageCaptureProps {
  onImageCaptured: (imageFile: File) => void;
}

const ImageCapture = ({ onImageCaptured }: ImageCaptureProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play();
          setIsCapturing(true);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Camera not available",
          description: "Your device doesn't support camera access",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera access to capture images",
      });
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        setImage(imageUrl);
        setImageFile(file);
        onImageCaptured(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
      });
      return;
    }
    
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setImageFile(file);
    onImageCaptured(file);
  };

  const resetImage = () => {
    setImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full shadow-card">
      <CardContent className="p-4">
        {isCapturing ? (
          <div className="relative">
            <video 
              ref={videoRef} 
              className="w-full h-64 md:h-80 object-cover rounded-lg"
              autoPlay 
              playsInline
            />
            <div className="absolute inset-0 camera-overlay rounded-lg flex items-center justify-center">
              <div className="text-white text-sm md:text-base">Position the food in the center</div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-black hover:bg-gray-100"
                onClick={stopCamera}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
              <Button
                className="bg-fresh hover:bg-fresh-dark text-white"
                onClick={captureImage}
                size="sm"
              >
                <Camera className="mr-1 h-4 w-4" />
                Capture
              </Button>
            </div>
          </div>
        ) : image ? (
          <div className="relative">
            <img 
              src={image} 
              alt="Captured food" 
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-white bg-opacity-70 hover:bg-opacity-100"
              onClick={resetImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={startCamera}
                className="h-32 flex flex-col items-center justify-center space-y-2 bg-fresh hover:bg-fresh-dark shadow-lg"
              >
                <Camera size={36} />
                <span>Take Photo</span>
              </Button>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="h-32 flex flex-col items-center justify-center space-y-2 bg-ripe hover:bg-ripe-dark shadow-lg"
              >
                <Upload size={36} />
                <span>Upload Photo</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              Take a clear photo of any fruit or vegetable to analyze freshness
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageCapture;
