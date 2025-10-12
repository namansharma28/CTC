"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { Camera, CameraOff, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileQRScanner from "./mobile-qr-scanner";

interface QRScannerProps {
    onScan: (data: string) => void;
    onError: (error: any) => void;
    isActive: boolean;
    onToggle: () => void;
}

export default function QRScanner({ onScan, onError, isActive, onToggle }: QRScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [isMobile, setIsMobile] = useState(false);
    const [showFallback, setShowFallback] = useState(false);
    const [isProcessingImage, setIsProcessingImage] = useState(false);

    useEffect(() => {
        // Detect mobile device
        const checkMobile = () => {
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                (window.innerWidth <= 768);
            setIsMobile(isMobileDevice);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const reader = new BrowserMultiFormatReader();
        setCodeReader(reader);

        // Get available video devices
        reader.listVideoInputDevices().then((videoInputDevices) => {
            setDevices(videoInputDevices);
            if (videoInputDevices.length > 0) {
                // Prefer back camera on mobile
                const backCamera = videoInputDevices.find(device =>
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('rear') ||
                    device.label.toLowerCase().includes('environment')
                );
                setSelectedDeviceId(backCamera?.deviceId || videoInputDevices[0].deviceId);
            }
        }).catch((error) => {
            console.error('Error listing video devices:', error);
            setShowFallback(true);
        });

        return () => {
            if (reader) {
                reader.reset();
            }
        };
    }, []);

    useEffect(() => {
        if (isActive && codeReader && selectedDeviceId) {
            startScanning();
        } else if (codeReader) {
            stopScanning();
        }
    }, [isActive, codeReader, selectedDeviceId]);

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: 'environment' }, // Prefer back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            // Stop the stream immediately, we just needed to check permission
            stream.getTracks().forEach(track => track.stop());
            setHasPermission(true);
            return true;
        } catch (error) {
            console.error('Camera permission denied:', error);
            setHasPermission(false);
            onError(new Error('Camera permission denied. Please allow camera access and try again.'));
            return false;
        }
    };

    const startScanning = async () => {
        if (!codeReader || !videoRef.current || !selectedDeviceId) return;

        try {
            // Request permission first
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) return;

            await codeReader.decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current,
                (result, error) => {
                    if (result) {
                        onScan(result.getText());
                    }
                    if (error && !(error.name === 'NotFoundException')) {
                        console.error('QR Scanner error:', error);
                    }
                }
            );
        } catch (error) {
            console.error('Error starting QR scanner:', error);
            onError(error);
            setShowFallback(true);
        }
    };

    const stopScanning = () => {
        if (codeReader) {
            codeReader.reset();
        }
    };

    const handleToggle = async () => {
        if (!isActive) {
            const hasPermission = await requestCameraPermission();
            if (hasPermission) {
                onToggle();
            }
        } else {
            onToggle();
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !codeReader) return;

        setIsProcessingImage(true);

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = async () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0);

                try {
                    const result = await codeReader.decodeFromImage(img);
                    onScan(result.getText());
                } catch (error) {
                    console.error('Error processing QR code from image:', error);
                    onError(new Error('Could not read QR code from image. Please try again with a clearer image.'));
                } finally {
                    setIsProcessingImage(false);
                }
            };

            img.onerror = () => {
                setIsProcessingImage(false);
                onError(new Error('Could not load image file.'));
            };

            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);

        } catch (error) {
            setIsProcessingImage(false);
            onError(error);
        }
    };

    // Show mobile-optimized scanner on mobile devices or when camera fails
    if (isMobile || showFallback) {
        return <MobileQRScanner onScan={onScan} onError={onError} />;
    }

    return (
        <div className="space-y-4">
            {!isActive ? (
                <div className="text-center space-y-4">
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Camera not active</p>
                            {hasPermission === false && (
                                <p className="text-sm text-red-500 mt-2">
                                    Camera permission required
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Button onClick={handleToggle} className="w-full">
                            <Camera className="mr-2 h-4 w-4" />
                            Start Camera
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="w-full"
                            disabled={isProcessingImage}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {isProcessingImage ? 'Processing...' : 'Upload Image'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="relative">
                        <video
                            ref={videoRef}
                            className="w-full h-64 bg-black rounded-lg object-cover"
                            playsInline
                            muted
                        />
                        <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-lg"></div>
                        </div>
                    </div>

                    {devices.length > 1 && (
                        <select
                            value={selectedDeviceId}
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                            className="w-full p-2 border rounded-md bg-background"
                        >
                            {devices.map((device) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                                </option>
                            ))}
                        </select>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleToggle} variant="outline">
                            <CameraOff className="mr-2 h-4 w-4" />
                            Stop Camera
                        </Button>
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            disabled={isProcessingImage}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            {isProcessingImage ? 'Processing...' : 'Upload'}
                        </Button>
                    </div>
                </div>
            )}

            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
            />
        </div>
    );
}