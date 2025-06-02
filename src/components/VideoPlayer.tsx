
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, X, AlertCircle } from "lucide-react";
import { extractYouTubeVideoId } from "@/utils/youtubeUtils";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

interface VideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ videoUrl, isOpen, onClose }: VideoPlayerProps) => {
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const isYouTubeVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const youTubeVideoId = isYouTubeVideo(videoUrl) ? extractYouTubeVideoId(videoUrl) : null;
  
  // YouTube player for YouTube videos
  const {
    isReady: youTubeReady,
    isPlaying: youTubePlaying,
    currentTime: youTubeCurrentTime,
    duration: youTubeDuration,
    volume: youTubeVolume,
    isMuted: youTubeIsMuted,
    error: youTubeError,
    isLoading: youTubeLoading,
    play: youTubePlay,
    pause: youTubePause,
    seekTo: youTubeSeekTo,
    setVolume: youTubeSetVolume,
    toggleMute: youTubeToggleMute,
  } = useYouTubePlayer(youTubeVideoId, 'youtube-player');

  // HTML5 video state for direct videos
  const [htmlIsPlaying, setHtmlIsPlaying] = useState(false);
  const [htmlCurrentTime, setHtmlCurrentTime] = useState(0);
  const [htmlDuration, setHtmlDuration] = useState(0);
  const [htmlVolume, setHtmlVolume] = useState(1);
  const [htmlIsMuted, setHtmlIsMuted] = useState(false);
  const [htmlLoading, setHtmlLoading] = useState(true);
  const [htmlError, setHtmlError] = useState<string | null>(null);

  // Unified state based on video type
  const isPlaying = youTubeVideoId ? youTubePlaying : htmlIsPlaying;
  const currentTime = youTubeVideoId ? youTubeCurrentTime : htmlCurrentTime;
  const duration = youTubeVideoId ? youTubeDuration : htmlDuration;
  const volume = youTubeVideoId ? youTubeVolume / 100 : htmlVolume;
  const isMuted = youTubeVideoId ? youTubeIsMuted : htmlIsMuted;
  const isLoading = youTubeVideoId ? youTubeLoading : htmlLoading;
  const error = youTubeVideoId ? youTubeError : htmlError;
  const playerReady = youTubeVideoId ? youTubeReady : !htmlLoading && !htmlError;

  const togglePlay = () => {
    if (youTubeVideoId) {
      if (youTubePlaying) {
        youTubePause();
      } else {
        youTubePlay();
      }
    } else if (videoRef.current) {
      if (htmlIsPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (youTubeVideoId) {
      youTubeToggleMute();
    } else if (videoRef.current) {
      const newMuted = !htmlIsMuted;
      videoRef.current.muted = newMuted;
      setHtmlIsMuted(newMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (youTubeVideoId) {
      youTubeSeekTo(time);
    } else if (videoRef.current) {
      videoRef.current.currentTime = time;
      setHtmlCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (youTubeVideoId) {
      youTubeSetVolume(vol * 100);
    } else if (videoRef.current) {
      videoRef.current.volume = vol;
      setHtmlVolume(vol);
      setHtmlIsMuted(vol === 0);
    }
  };

  const handleFullscreen = () => {
    if (playerContainerRef.current) {
      if (!isFullscreen) {
        playerContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
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

  // HTML5 video event handlers
  const handleHtmlTimeUpdate = () => {
    if (videoRef.current) {
      setHtmlCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleHtmlLoadedMetadata = () => {
    if (videoRef.current) {
      setHtmlDuration(videoRef.current.duration);
      setHtmlLoading(false);
      setHtmlError(null);
    }
  };

  const handleHtmlError = () => {
    console.error('HTML5 video error');
    setHtmlError('Failed to load video. Please check the video URL.');
    setHtmlLoading(false);
  };

  const handleHtmlCanPlay = () => {
    setHtmlLoading(false);
    setHtmlError(null);
  };

  const retryLoad = () => {
    if (youTubeVideoId) {
      // For YouTube videos, we can't easily retry, but we can close and reopen
      onClose();
    } else if (videoRef.current) {
      setHtmlLoading(true);
      setHtmlError(null);
      videoRef.current.load();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setHtmlIsPlaying(false);
      setHtmlCurrentTime(0);
      setHtmlLoading(true);
      setHtmlError(null);
      setIsFullscreen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 bg-black">
        <div 
          ref={playerContainerRef}
          className="relative w-full h-full flex items-center justify-center"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>

          {error ? (
            <div className="flex flex-col items-center justify-center text-white space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-lg text-center">{error}</p>
              <Button onClick={retryLoad} variant="outline" className="text-white border-white">
                Try Again
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center text-white space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p>Loading video...</p>
            </div>
          ) : (
            <div
              className="relative w-full h-full cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setShowControls(false)}
            >
              {youTubeVideoId ? (
                <div id="youtube-player" className="w-full h-full" />
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleHtmlTimeUpdate}
                  onLoadedMetadata={handleHtmlLoadedMetadata}
                  onCanPlay={handleHtmlCanPlay}
                  onError={handleHtmlError}
                  onPlay={() => setHtmlIsPlaying(true)}
                  onPause={() => setHtmlIsPlaying(false)}
                  onClick={togglePlay}
                  crossOrigin="anonymous"
                  preload="metadata"
                />
              )}

              {/* Custom Video Controls */}
              {playerReady && (
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
                      onClick={handleFullscreen}
                      className="text-white hover:bg-gray-700"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Click overlay for YouTube videos */}
              {youTubeVideoId && playerReady && (
                <div 
                  className="absolute inset-0 z-10"
                  onClick={togglePlay}
                />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
