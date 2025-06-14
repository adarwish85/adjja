
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";
import { VideoJSPlayer } from "./VideoJSPlayer";

interface SelfHostedVideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  poster?: string;
}

export const SelfHostedVideoPlayer: React.FC<SelfHostedVideoPlayerProps> = ({
  videoUrl,
  isOpen,
  onClose,
  title = "Video Preview",
  poster
}) => {
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleError = useCallback((error: any) => {
    console.error('Video failed to load:', error);
    setHasError(true);
  }, []);

  const handleReady = useCallback(() => {
    setIsReady(true);
    setHasError(false);
  }, []);

  const resetState = () => {
    setHasError(false);
    setIsReady(false);
  };

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  const renderErrorContent = () => (
    <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
      <AlertCircle className="h-16 w-16 text-orange-500" />
      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-xl font-semibold">Video Unavailable</h3>
        <p className="text-gray-300">
          Sorry, this video could not be loaded. Please check the video URL or try again later.
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[70vh] p-0 bg-black overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="absolute top-4 left-4 z-50 text-white">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          
          {hasError ? renderErrorContent() : (
            <div className="w-full h-full">
              <VideoJSPlayer
                src={videoUrl}
                poster={poster}
                onReady={handleReady}
                onError={handleError}
                playing={true}
                muted={true}
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
