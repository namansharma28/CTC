'use client'; 
 
import { useState, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { Download, X, Smartphone } from 'lucide-react'; 
import { Button } from "@/components/ui/button";
 
interface BeforeInstallPromptEvent extends Event { 
  readonly platforms: string[]; 
  readonly userChoice: Promise<{ 
    outcome: 'accepted' | 'dismissed'; 
    platform: string; 
  }>; 
  prompt(): Promise<void>; 
} 

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Register service worker with better error handling 
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') { 
      navigator.serviceWorker 
        .register('/sw.js') 
        .then((registration) => { 
          console.log('SW registered: ', registration); 
          
          // Handle service worker updates 
          registration.addEventListener('updatefound', () => { 
            const newWorker = registration.installing; 
            if (newWorker) { 
              newWorker.addEventListener('statechange', () => { 
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) { 
                  // New content is available, refresh the page 
                  window.location.reload(); 
                } 
              }); 
            } 
          }); 
        }) 
        .catch((registrationError) => { 
          console.log('SW registration failed: ', registrationError); 
        }); 
    } 

    // Listen for beforeinstallprompt event 
    const handleBeforeInstallPrompt = (e: Event) => { 
      e.preventDefault(); 
      setDeferredPrompt(e as BeforeInstallPromptEvent); 
      setIsInstallable(true);
    }; 

    // Check if app is already installed 
    const handleAppInstalled = () => { 
      setIsInstalled(true); 
      setIsInstallable(false);
      setDeferredPrompt(null); 
    }; 

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt); 
    window.addEventListener('appinstalled', handleAppInstalled); 

    // Check if running in standalone mode (already installed) 
    if (window.matchMedia('(display-mode: standalone)').matches) { 
      setIsInstalled(true); 
    } 

    return () => { 
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt); 
      window.removeEventListener('appinstalled', handleAppInstalled); 
    }; 
  }, []); 

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, isInstalled, installApp };
};
 
const PWAInstaller = () => { 
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null); 
  const [showInstallPrompt, setShowInstallPrompt] = useState(false); 
  const [isInstalled, setIsInstalled] = useState(false); 

  useEffect(() => { 
    // Register service worker with better error handling 
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') { 
      navigator.serviceWorker 
        .register('/sw.js') 
        .then((registration) => { 
          console.log('SW registered: ', registration); 
          
          // Handle service worker updates 
          registration.addEventListener('updatefound', () => { 
            const newWorker = registration.installing; 
            if (newWorker) { 
              newWorker.addEventListener('statechange', () => { 
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) { 
                  // New content is available, refresh the page 
                  window.location.reload(); 
                } 
              }); 
            } 
          }); 
        }) 
        .catch((registrationError) => { 
          console.log('SW registration failed: ', registrationError); 
        }); 
    } 

    // Listen for beforeinstallprompt event 
    const handleBeforeInstallPrompt = (e: Event) => { 
      e.preventDefault(); 
      setDeferredPrompt(e as BeforeInstallPromptEvent); 
      setShowInstallPrompt(true); 
    }; 

    // Check if app is already installed 
    const handleAppInstalled = () => { 
      setIsInstalled(true); 
      setShowInstallPrompt(false); 
      setDeferredPrompt(null); 
    }; 

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt); 
    window.addEventListener('appinstalled', handleAppInstalled); 

    // Check if running in standalone mode (already installed) 
    if (window.matchMedia('(display-mode: standalone)').matches) { 
      setIsInstalled(true); 
    } 

    return () => { 
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt); 
      window.removeEventListener('appinstalled', handleAppInstalled); 
    }; 
  }, []); 

  const handleInstallClick = async () => { 
    if (!deferredPrompt) return; 

    deferredPrompt.prompt(); 
    const { outcome } = await deferredPrompt.userChoice; 
    
    if (outcome === 'accepted') { 
      console.log('User accepted the install prompt'); 
    } else { 
      console.log('User dismissed the install prompt'); 
    } 
    
    setDeferredPrompt(null); 
    setShowInstallPrompt(false); 
  }; 

  const handleDismiss = () => { 
    setShowInstallPrompt(false); 
  }; 

  if (isInstalled || !showInstallPrompt) { 
    return null; 
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-16 left-4 right-4 z-50 rounded-lg border bg-card p-4 shadow-lg md:left-auto md:right-4 md:w-80"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Install App</h3>
                <p className="text-sm text-muted-foreground">Add CTC to your home screen</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Not now
            </Button>
            <Button size="sm" onClick={handleInstallClick} className="gap-1">
              <Download className="h-4 w-4" />
              Install
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstaller;