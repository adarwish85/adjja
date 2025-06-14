
import React, { useState, useCallback } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, AlertCircle } from "lucide-react";
import { extractYouTubeVideoId } from "@/utils/youtubeUtils";

interface ReliableVideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ReliableVideoPlayer: React.FC<ReliableVideoPlayerProps> = ({
  videoUrl,
  isOpen,
  onClose,
  title = "Video Preview"
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const videoId = extractYouTubeVideoId(videoUrl);
  const cleanVideoUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : videoUrl;

  const handleError = useCallback(() => {
    console.error('Video failed to load:', videoUrl);
    setShowFallback(true);
  }, [videoUrl]);

  const handleReady = useCallback(() => {
    setIsReady(true);
    setShowFallback(false);
  }, []);

  const resetState = () => {
    setShowFallback(false);
    setIsReady(false);
  };

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  // Disable right-click context menu to prevent "Open in YouTube"
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Disable keyboard shortcuts that could reveal source
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Disable common shortcuts that might open YouTube
    if (
      (e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U') || // View source
      (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I') || // Dev tools
      e.key === 'F12' // Dev tools
    ) {
      e.preventDefault();
    }
  };

  const renderFallbackContent = () => (
    <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
      <AlertCircle className="h-16 w-16 text-orange-500" />
      <div className="text-center space-y-3 max-w-md">
        <h3 className="text-xl font-semibold">Video Unavailable</h3>
        <p className="text-gray-300">
          Sorry, this video could not be loaded right now. Please try again later.
        </p>
      </div>
    </div>
  );

  const renderLoadingContent = () => (
    <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
        <Play className="absolute inset-0 m-auto h-6 w-6 text-white" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Loading Video</h3>
        <p className="text-gray-300">Preparing your preview...</p>
      </div>
    </div>
  );

  const renderVideoPlayer = () => {
    if (!ReactPlayer.canPlay(cleanVideoUrl)) {
      return renderFallbackContent();
    }

    return (
      <div 
        className="relative w-full h-full min-h-[400px] bg-black"
        onContextMenu={handleContextMenu}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <ReactPlayer
          url={cleanVideoUrl}
          playing={true}
          controls={true}
          width="100%"
          height="100%"
          muted={true}
          onError={handleError}
          onReady={handleReady}
          config={{
            youtube: {
              playerVars: {
                // Maximum branding minimization within legal limits
                modestbranding: 1,        // Minimize YouTube branding
                rel: 0,                   // Don't show related videos at end
                showinfo: 0,              // Don't show video title/uploader
                iv_load_policy: 3,        // Don't show video annotations
                cc_load_policy: 0,        // Don't show captions by default
                playsinline: 1,           // Play inline on mobile
                origin: window.location.origin,
                enablejsapi: 1,
                fs: 1,                    // Allow fullscreen
                controls: 1,              // Show player controls
                disablekb: 0,             // Keep keyboard controls for accessibility
                autoplay: 0,              // Don't autoplay
                start: 0,                 // Start from beginning
                end: 0,                   // Play full video
                loop: 0,                  // Don't loop
                playlist: '',             // No playlist
                color: 'white',           // Use white progress bar
                hl: 'en',                 // Set language to English
                widget_referrer: window.location.origin
              },
              embedOptions: {
                // Additional embed options to minimize branding
                host: 'https://www.youtube-nocookie.com'
              }
            }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'auto'
          }}
        />
        {!isReady && !showFallback && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            {renderLoadingContent()}
          </div>
        )}
        
        {/* Custom overlay to prevent some user interactions */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />
      </div>
    );
  };

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
          
          {/* Custom header with your branding */}
          <div className="absolute top-4 left-4 z-50 text-white">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          
          {showFallback ? renderFallbackContent() : renderVideoPlayer()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
