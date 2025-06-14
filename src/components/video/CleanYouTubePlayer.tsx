
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, AlertCircle } from "lucide-react";
import { extractYouTubeVideoId } from "@/utils/youtubeUtils";

interface CleanYouTubePlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const CleanYouTubePlayer: React.FC<CleanYouTubePlayerProps> = ({
  videoUrl,
  isOpen,
  onClose,
  title = "Video Preview"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const videoId = extractYouTubeVideoId(videoUrl);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setHasError(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    if (!videoId) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Set a reasonable timeout for video loading
    timeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 8000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, videoId, isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const getEmbedUrl = () => {
    if (!videoId) return '';
    
    const params = new URLSearchParams({
      autoplay: '1',
      modestbranding: '1',
      rel: '0',
      showinfo: '0',
      controls: '1',
      fs: '1',
      enablejsapi: '1',
      origin: window.location.origin,
      iv_load_policy: '3',
      cc_load_policy: '0',
      playsinline: '1'
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  };

  const renderContent = () => {
    if (hasError || !videoId) {
      return (
        <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
          <AlertCircle className="h-16 w-16 text-orange-500" />
          <div className="text-center space-y-3 max-w-md">
            <h3 className="text-xl font-semibold">Preview Unavailable</h3>
            <p className="text-gray-300">
              The video preview is currently unavailable. Please contact support if this issue persists.
            </p>
          </div>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
            <Play className="absolute inset-0 m-auto h-6 w-6 text-white" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Loading Preview</h3>
            <p className="text-gray-300">Preparing your video...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full min-h-[400px]">
        <iframe
          ref={iframeRef}
          src={getEmbedUrl()}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="w-full h-full min-h-[400px] rounded-lg"
          title={title}
        />
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[70vh] p-0 bg-black">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
