"use client";

import { useRef, useState, useCallback } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MobileQRScannerProps {
  onScan: (data: string) => void;
  onError: (error: any) => void;
}

export default function MobileQRScanner({ onScan, onError }: MobileQRScannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processImageFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Create a canvas to process the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        try {
          // Try to use ZXing library if available
          const { BrowserMultiFormatReader } = await import('@zxing/library');
          const codeReader = new BrowserMultiFormatReader();
          
          const result = await codeReader.decodeFromImage(img);
          onScan(result.getText());
        } catch (error) {
          console.error('Error processing QR code:', error);
          onError(new Error('Could not read QR code from image. Please try again with a clearer image.'));
        } finally {
          setIsProcessing(false);
        }
      };
      
      img.onerror = () => {
        setIsProcessing(false);
        onError(new Error('Could not load image file.'));
      };
      
      // Convert file to data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      setIsProcessing(false);
      onError(error);
    }
  }, [onScan, onError]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    } else {
      onError(new Error('Please select a valid image file.'));
    }
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isProcessing ? 'Processing image...' : 'Take a photo or select an image'}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={openCamera} 
            className="w-full"
            disabled={isProcessing}
          >
            <Camera className="mr-2 h-4 w-4" />
            {isProcessing ? 'Processing...' : 'Take Photo / Select Image'}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            On mobile: Use camera to take a photo of the QR code
          </p>
        </div>
      </div>
      
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}