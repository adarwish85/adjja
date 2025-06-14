import ReactPlayer from "react-player";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, ExternalLink } from "lucide-react";
import { useVideoPlayerState } from "@/hooks/useVideoPlayerState";
import { VideoLoadingState } from "@/components/video/VideoLoadingState";
import { VideoErrorState } from "@/components/video/VideoErrorState";
import { VideoControls } from "@/components/video/VideoControls";
import { formatTime, openVideoExternally, requestFullscreen } from "@/utils/videoUtils";

interface VideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ videoUrl, isOpen, onClose }: VideoPlayerProps) => {
  const {
    playing,
    volume,
    muted,
    duration,
    currentTime,
    showControls,
    loading,
    error,
    playerReady,
    loadingTimeout,
    processedUrl,
    validationResult,
    playerRef,
    controlsTimeoutRef,
    setPlaying,
    setVolume,
    setMuted,
    setDuration,
    setCurrentTime,
    setShowControls,
    setLoading,
    setError,
    setPlayerReady,
    setLoadingTimeout,
    startLoadingTimeout,
    clearLoadingTimeout,
  } = useVideoPlayerState(videoUrl, isOpen);

  console.log('VideoPlayer state:', { 
    videoUrl, 
    processedUrl, 
    isOpen, 
    loading, 
    error, 
    validationResult 
  });

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    console.log('Video duration:', duration);
    setDuration(duration);
  };

  const handleReady = () => {
    console.log('✅ React Player ready for:', processedUrl);
    clearLoadingTimeout();
    setPlayerReady(true);
    setLoading(false);
    setError(null);
    setLoadingTimeout(false);
  };

  const handleError = (error: any) => {
    console.error('❌ React Player error for:', processedUrl, error);
    clearLoadingTimeout();
    
    // Provide more specific error messages
    let errorMessage = 'Failed to load video.';
    if (validationResult && !validationResult.embeddable) {
      errorMessage = 'This video cannot be embedded due to YouTube restrictions.';
    } else if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      errorMessage = 'This YouTube video cannot be played here. It may be private, restricted, or have embedding disabled.';
    } else {
      errorMessage = 'The video format may not be supported or the video is unavailable.';
    }
    
    setError(errorMessage);
    setLoading(false);
    setPlayerReady(false);
    setLoadingTimeout(false);
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
    console.log('🔄 Retrying video load for:', videoUrl);
    setError(null);
    setLoading(true);
    setPlayerReady(false);
    setLoadingTimeout(false);
    startLoadingTimeout();
  };

  const handleOpenExternally = () => {
    openVideoExternally(videoUrl); // Use original URL for external opening
  };

  // Check if the processed URL is supported by React Player
  const isSupported = processedUrl ? ReactPlayer.canPlay(processedUrl) : false;
  
  if (!isSupported && processedUrl && isOpen) {
    console.warn('Video URL not supported by React Player:', processedUrl);
  }

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

          {!isSupported && processedUrl ? (
            <div className="flex flex-col items-center justify-center text-white space-y-4 p-8">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Unsupported Video Format</h3>
                <p className="text-gray-300 max-w-md">This video format is not supported by the embedded player.</p>
              </div>
              <Button 
                onClick={handleOpenExternally}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Watch on YouTube
              </Button>
            </div>
          ) : error ? (
            <VideoErrorState
              error={error}
              loadingTimeout={loadingTimeout}
              videoUrl={videoUrl}
              loading={loading}
              validationResult={validationResult}
              onRetry={retryLoad}
              onOpenExternally={handleOpenExternally}
            />
          ) : loading || !processedUrl ? (
            <VideoLoadingState onOpenExternally={handleOpenExternally} />
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
              <ReactPlayer
                ref={playerRef}
                url={processedUrl}
                width="100%"
                height="100%"
                playing={playing}
                volume={volume}
                muted={muted}
                onReady={handleReady}
                onError={handleError}
                onProgress={(state) => setCurrentTime(state.playedSeconds)}
                onDuration={setDuration}
                onStart={() => {
                  console.log('Video started playing');
                  clearLoadingTimeout();
                  setLoading(false);
                }}
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
                  },
                  file: {
                    attributes: {
                      crossOrigin: 'anonymous',
                      preload: 'metadata'
                    }
                  }
                }}
              />

              {/* Custom Video Controls */}
              {playerReady && (
                <VideoControls
                  playing={playing}
                  muted={muted}
                  volume={volume}
                  currentTime={currentTime}
                  duration={duration}
                  showControls={showControls}
                  onTogglePlay={() => setPlaying(!playing)}
                  onToggleMute={() => setMuted(!muted)}
                  onSeek={(e) => {
                    const time = parseFloat(e.target.value);
                    if (playerRef.current) {
                      playerRef.current.seekTo(time, 'seconds');
                    }
                  }}
                  onVolumeChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setVolume(vol);
                    setMuted(vol === 0);
                  }}
                  onFullscreen={requestFullscreen}
                  formatTime={formatTime}
                />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
