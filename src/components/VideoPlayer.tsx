
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, X } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ videoUrl, isOpen, onClose }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [videoSrc, setVideoSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Extract YouTube video ID
  const extractYouTubeVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const isYouTubeVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Get direct video URL for YouTube videos
  const getDirectVideoUrl = async (url: string): Promise<string> => {
    if (isYouTubeVideo(url)) {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        // Use a YouTube video extraction service or API
        // For now, we'll use a fallback approach with YouTube's direct video URLs
        // Note: This might need to be updated based on YouTube's current policies
        try {
          // Try different quality formats
          const formats = [
            `https://www.youtube.com/watch?v=${videoId}&format=mp4`,
            `https://youtu.be/${videoId}`,
          ];
          
          // For demonstration, we'll use the original URL but handle it differently
          // In a production environment, you'd want to use a proper YouTube extraction service
          return url;
        } catch (error) {
          console.error('Error extracting YouTube video:', error);
          return url;
        }
      }
    }
    return url;
  };

  useEffect(() => {
    if (isOpen && videoUrl) {
      setIsLoading(true);
      getDirectVideoUrl(videoUrl).then((directUrl) => {
        setVideoSrc(directUrl);
        setIsLoading(false);
      });
    }
  }, [isOpen, videoUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
      setIsMuted(vol === 0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setCurrentTime(0);
      setVideoSrc("");
      setIsLoading(true);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 bg-black">
        <div className="relative w-full h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>

          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div
              className="relative w-full h-full cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setShowControls(false)}
            >
              <video
                ref={videoRef}
                src={isYouTubeVideo(videoSrc) ? undefined : videoSrc}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                crossOrigin="anonymous"
                preload="metadata"
                onError={(e) => {
                  console.error('Video error:', e);
                  // Fallback for YouTube videos - show error message
                  if (isYouTubeVideo(videoUrl)) {
                    console.warn('YouTube video cannot be played directly due to CORS restrictions');
                  }
                }}
              >
                {isYouTubeVideo(videoSrc) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                    <div className="text-center">
                      <p className="mb-4">Unable to play YouTube video directly</p>
                      <p className="text-sm text-gray-400">Please use the original YouTube link to view this content</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => window.open(videoUrl, '_blank')}
                      >
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                )}
              </video>

              {/* Custom Video Controls */}
              {!isYouTubeVideo(videoSrc) && (
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={togglePlay}
                        className="text-white hover:bg-gray-700"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="text-white hover:bg-gray-700"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => videoRef.current?.requestFullscreen()}
                      className="text-white hover:bg-gray-700"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
