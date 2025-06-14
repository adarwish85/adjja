
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, X, AlertCircle, RefreshCw } from "lucide-react";

interface ReactVideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReactVideoPlayer = ({ videoUrl, isOpen, onClose }: ReactVideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  
  const playerRef = useRef<ReactPlayer>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleReady = () => {
    console.log('✅ React Player ready');
    setPlayerReady(true);
    setLoading(false);
    setError(null);
  };

  const handleError = (error: any) => {
    console.error('❌ React Player error:', error);
    setError('Failed to load video. Please check your internet connection or try again.');
    setLoading(false);
    setPlayerReady(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(time, 'seconds');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setMuted(vol === 0);
  };

  const togglePlay = () => {
    setPlaying(!playing);
  };

  const toggleMute = () => {
    setMuted(!muted);
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
    console.log('🔄 Retrying video load');
    setError(null);
    setLoading(true);
    setPlayerReady(false);
  };

  // Reset states when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setPlaying(false);
      setCurrentTime(0);
      setLoading(true);
      setError(null);
      setPlayerReady(false);
    }
  }, [isOpen]);

  const renderErrorState = () => (
    <div className="flex flex-col items-center justify-center text-white space-y-4 p-8">
      <AlertCircle className="h-16 w-16 text-red-500" />
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Video Loading Error</h3>
        <p className="text-gray-300 max-w-md">{error}</p>
      </div>
      <div className="flex gap-3">
        <Button 
          onClick={retryLoad} 
          variant="outline" 
          className="text-white border-white hover:bg-white hover:text-black"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Try Again'}
        </Button>
        {ReactPlayer.canPlay(videoUrl) && (
          <Button 
            onClick={() => window.open(videoUrl, '_blank')}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black"
          >
            Open Externally
          </Button>
        )}
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center text-white space-y-4 p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      <div className="text-center space-y-2">
        <p className="text-lg">Loading video...</p>
      </div>
    </div>
  );

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

          {error ? (
            renderErrorState()
          ) : loading ? (
            renderLoadingState()
          ) : (
            <div
              className="relative w-full h-full cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setShowControls(false)}
            >
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                width="100%"
                height="100%"
                playing={playing}
                volume={volume}
                muted={muted}
                onReady={handleReady}
                onError={handleError}
                onProgress={handleProgress}
                onDuration={handleDuration}
                onStart={() => setLoading(false)}
                controls={false}
                config={{
                  youtube: {
                    playerVars: {
                      controls: 0,
                      modestbranding: 1,
                      rel: 0,
                      showinfo: 0,
                      fs: 0,
                      disablekb: 1,
                      iv_load_policy: 3,
                      cc_load_policy: 0,
                      playsinline: 1,
                    }
                  }
                }}
              />

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
                      onChange={handleSeek}
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
                        onClick={togglePlay}
                        className="text-white hover:bg-gray-700 p-3"
                      >
                        {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="text-white hover:bg-gray-700 p-2"
                        >
                          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                      </div>

                      <span className="text-white text-base font-medium">
                        {formatTime(currentTime)} / {formatTime(duration)}
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
