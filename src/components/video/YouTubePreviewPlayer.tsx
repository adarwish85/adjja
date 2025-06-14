
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Play, AlertCircle, ExternalLink } from "lucide-react";
import { extractYouTubeVideoId, getYouTubeThumbnail, validateYouTubeUrl } from "@/utils/youtubeUtils";

interface YouTubePreviewPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const YouTubePreviewPlayer: React.FC<YouTubePreviewPlayerProps> = ({
  videoUrl,
  isOpen,
  onClose,
  title = "Video Preview"
}) => {
  const [playerReady, setPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Clean and validate the YouTube URL
  const videoId = extractYouTubeVideoId(videoUrl);
  const isValidUrl = validateYouTubeUrl(videoUrl).isValid;
  const thumbnail = videoId ? getYouTubeThumbnail(videoUrl) : null;

  useEffect(() => {
    if (!isOpen) {
      // Reset states when dialog closes
      setPlayerReady(false);
      setError(null);
      setLoading(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    if (!isValidUrl || !videoId) {
      setError('Invalid YouTube URL');
      setLoading(false);
      return;
    }

    // Set a timeout for loading
    timeoutRef.current = setTimeout(() => {
      if (!playerReady) {
        setError('Video is taking too long to load. It may be restricted or unavailable.');
        setLoading(false);
      }
    }, 10000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, isValidUrl, videoId, playerReady]);

  const handleReady = () => {
    console.log('YouTube player ready for video:', videoId);
    setPlayerReady(true);
    setLoading(false);
    setError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleError = (error: any) => {
    console.error('YouTube player error:', error);
    setError('This video cannot be played. It may be restricted by the content owner or unavailable in your region.');
    setLoading(false);
    setPlayerReady(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const openInYouTube = () => {
    window.open(videoUrl, '_blank');
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
          <AlertCircle className="h-16 w-16 text-red-500" />
          <div className="text-center space-y-3 max-w-md">
            <h3 className="text-xl font-semibold">Video Unavailable</h3>
            <p className="text-gray-300">{error}</p>
          </div>
          <Button 
            onClick={openInYouTube}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Watch on YouTube
          </Button>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-white space-y-6 p-8 min-h-[400px]">
          <div className="relative">
            {thumbnail && (
              <img 
                src={thumbnail} 
                alt={title}
                className="w-80 h-45 object-cover rounded-lg opacity-50"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Loading Video</h3>
            <p className="text-gray-300">Preparing your video...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={false}
          controls={true}
          onReady={handleReady}
          onError={handleError}
          config={{
            youtube: {
              playerVars: {
                controls: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                fs: 1,
                disablekb: 0,
                iv_load_policy: 3,
                cc_load_policy: 0,
                playsinline: 1,
                origin: window.location.origin,
                enablejsapi: 1,
                autoplay: 0
              },
              embedOptions: {
                host: 'https://www.youtube-nocookie.com'
              }
            }
          }}
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
