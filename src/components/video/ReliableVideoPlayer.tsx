
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
      <div className="relative w-full h-full min-h-[400px] bg-black">
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
            playerVars: {
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              cc_load_policy: 0,
              playsinline: 1,
              origin: window.location.origin,
              enablejsapi: 1,
              fs: 1,
              controls: 1
            }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        {!isReady && !showFallback && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            {renderLoadingContent()}
          </div>
        )}
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
          {showFallback ? renderFallbackContent() : renderVideoPlayer()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
