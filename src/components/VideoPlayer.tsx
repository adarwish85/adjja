import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, X, AlertCircle, RefreshCw } from "lucide-react";
import { extractYouTubeVideoId, checkVideoAvailability } from "@/utils/youtubeUtils";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";

interface VideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ videoUrl, isOpen, onClose }: VideoPlayerProps) => {
  const [showControls, setShowControls] = useState(true);
  const [videoAvailable, setVideoAvailable] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
    retryLoad: youTubeRetryLoad,
  } = useYouTubePlayer(youTubeVideoId, 'youtube-player');

  // HTML5 video state for direct videos
  const [htmlIsPlaying, setHtmlIsPlaying] = useState(false);
  const [htmlCurrentTime, setHtmlCurrentTime] = useState(0);
  const [htmlDuration, setHtmlDuration] = useState(0);
  const [htmlVolume, setHtmlVolume] = useState(1);
  const [htmlIsMuted, setHtmlIsMuted] = useState(false);
  const [htmlLoading, setHtmlLoading] = useState(true);
  const [htmlError, setHtmlError] = useState<string | null>(null);

  // Check video availability for YouTube videos
  useEffect(() => {
    if (youTubeVideoId && isOpen) {
      console.log('Checking video availability for:', youTubeVideoId);
      checkVideoAvailability(youTubeVideoId)
        .then(available => {
          console.log('Video availability:', available);
          setVideoAvailable(available);
        })
        .catch(err => {
          console.error('Error checking video availability:', err);
          setVideoAvailable(false);
        });
    }
  }, [youTubeVideoId, isOpen]);

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

  const retryLoad = () => {
    console.log('Retrying video load');
    if (youTubeVideoId) {
      setVideoAvailable(null);
      youTubeRetryLoad();
    } else if (videoRef.current) {
      setHtmlLoading(true);
      setHtmlError(null);
      videoRef.current.load();
    }
  };

  const renderErrorState = () => {
    const errorTitle = youTubeVideoId && videoAvailable === false 
      ? "Video Not Available" 
      : "Video Loading Error";
    
    const errorMessage = youTubeVideoId && videoAvailable === false
      ? "This video cannot be embedded or is not available in your region."
      : error || "Failed to load video. Please check your internet connection.";

    return (
      <div className="flex flex-col items-center justify-center text-white space-y-4 p-8">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">{errorTitle}</h3>
          <p className="text-gray-300 max-w-md">{errorMessage}</p>
          {youTubeVideoId && (
            <p className="text-sm text-gray-400">Video ID: {youTubeVideoId}</p>
          )}
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={retryLoad} 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-black"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Try Again'}
          </Button>
          {youTubeVideoId && (
            <Button 
              onClick={() => window.open(`https://www.youtube.com/watch?v=${youTubeVideoId}`, '_blank')}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              Open on YouTube
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center text-white space-y-4 p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      <div className="text-center space-y-2">
        <p className="text-lg">Loading video...</p>
        {youTubeVideoId && (
          <p className="text-sm text-gray-400">Initializing YouTube player</p>
        )}
      </div>
    </div>
  );

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

  useEffect(() => {
    if (!isOpen) {
      setHtmlIsPlaying(false);
      setHtmlCurrentTime(0);
      setHtmlLoading(true);
      setHtmlError(null);
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

          {error || (youTubeVideoId && videoAvailable === false) ? (
            renderErrorState()
          ) : isLoading || (youTubeVideoId && videoAvailable === null) ? (
            renderLoadingState()
          ) : (
            <div
              className="relative w-full h-full cursor-pointer"
              onMouseMove={() => {
                setShowControls(true);
                if (controlsTimeoutRef.current) {
                  clearTimeout(controlsTimeoutRef.current);
                }
                controlsTimeoutRef.current = setTimeout(() => {
                  setShowControls(false);
                }, 3000);
              }}
              onMouseLeave={() => setShowControls(false)}
            >
              {youTubeVideoId ? (
                <div className="relative w-full h-full">
                  <div 
                    id="youtube-player" 
                    className="w-full h-full"
                    style={{ minHeight: '360px' }}
                  />
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      setHtmlCurrentTime(videoRef.current.currentTime);
                    }
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      setHtmlDuration(videoRef.current.duration);
                      setHtmlLoading(false);
                      setHtmlError(null);
                    }
                  }}
                  onCanPlay={() => {
                    setHtmlLoading(false);
                    setHtmlError(null);
                  }}
                  onError={() => {
                    console.error('HTML5 video error');
                    setHtmlError('Failed to load video. Please check the video URL.');
                    setHtmlLoading(false);
                  }}
                  onPlay={() => setHtmlIsPlaying(true)}
                  onPause={() => setHtmlIsPlaying(false)}
                  onClick={() => {
                    if (videoRef.current) {
                      if (htmlIsPlaying) {
                        videoRef.current.pause();
                      } else {
                        videoRef.current.play();
                      }
                    }
                  }}
                  crossOrigin="anonymous"
                  preload="metadata"
                />
              )}

              {/* Custom Video Controls */}
              {playerReady && (
                <div
                  className={`absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={(e) => {
                        const time = parseFloat(e.target.value);
                        if (youTubeVideoId) {
                          youTubeSeekTo(time);
                        } else if (videoRef.current) {
                          videoRef.current.currentTime = time;
                          setHtmlCurrentTime(time);
                        }
                      }}
                      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider accent-white"
                      style={{
                        background: `linear-gradient(to right, white 0%, white ${(currentTime / (duration || 1)) * 100}%, #4B5563 ${(currentTime / (duration || 1)) * 100}%, #4B5563 100%)`
                      }}
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => {
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
                        }}
                        className="text-white hover:bg-gray-700 p-3"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (youTubeVideoId) {
                              youTubeToggleMute();
                            } else if (videoRef.current) {
                              const newMuted = !htmlIsMuted;
                              videoRef.current.muted = newMuted;
                              setHtmlIsMuted(newMuted);
                            }
                          }}
                          className="text-white hover:bg-gray-700 p-2"
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => {
                            const vol = parseFloat(e.target.value);
                            if (youTubeVideoId) {
                              youTubeSetVolume(vol * 100);
                            } else if (videoRef.current) {
                              videoRef.current.volume = vol;
                              setHtmlVolume(vol);
                              setHtmlIsMuted(vol === 0);
                            }
                          }}
                          className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>

                      <span className="text-white text-base font-medium">
                        {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const elem = document.documentElement;
                        if (elem.requestFullscreen) {
                          elem.requestFullscreen();
                        }
                      }}
                      className="text-white hover:bg-gray-700 p-2"
                    >
                      <Maximize className="h-5 w-5" />
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
