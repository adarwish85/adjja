
import React from 'react';
import ReactPlayer from 'react-player';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEnhancedVideoPlayer } from "@/hooks/useEnhancedVideoPlayer";
import { VideoJSPlayer } from "@/components/video/VideoJSPlayer";
import { CustomLoadingState } from "@/components/video/CustomLoadingState";
import { CustomErrorState } from "@/components/video/CustomErrorState";
import { VideoControls } from "@/components/video/VideoControls";
import { formatTime, requestFullscreen } from "@/utils/videoUtils";

interface EnhancedVideoPlayerProps {
  primaryUrl: string;
  fallbackUrls?: string[];
  mp4Urls?: string[];
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
  poster?: string;
}

export const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({ 
  primaryUrl,
  fallbackUrls = [],
  mp4Urls = [],
  isOpen, 
  onClose,
  onDownload,
  poster
}) => {
  const {
    playing,
    volume,
    muted,
    duration,
    currentTime,
    loading,
    error,
    playerReady,
    currentPlayerType,
    loadingProgress,
    setPlaying,
    setVolume,
    setMuted,
    setDuration,
    setCurrentTime,
    getCurrentVideoUrl,
    retryCurrentSource,
    handlePlayerReady,
    handlePlayerError,
  } = useEnhancedVideoPlayer(
    { 
      primaryUrl, 
      fallbackUrls, 
      mp4Urls,
      timeoutDuration: 5000 
    }, 
    isOpen
  );

  const videoUrl = getCurrentVideoUrl();

  const handleProgress = (state: any) => {
    if (typeof state === 'number') {
      // Video.js progress
      setCurrentTime(state);
    } else {
      // ReactPlayer progress
      setCurrentTime(state.playedSeconds);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    // Seeking will be handled by the individual player components
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setMuted(vol === 0);
  };

  const renderPlayer = () => {
    if (currentPlayerType === 'videojs') {
      return (
        <VideoJSPlayer
          src={videoUrl}
          poster={poster}
          onReady={handlePlayerReady}
          onError={handlePlayerError}
          onProgress={handleProgress}
          onDuration={setDuration}
          playing={playing}
          volume={volume}
          muted={muted}
          className="w-full h-full"
        />
      );
    }

    return (
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        onReady={handlePlayerReady}
        onError={handlePlayerError}
        onProgress={handleProgress}
        onDuration={setDuration}
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
              origin: window.location.origin,
              enablejsapi: 0,
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
    );
  };

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
            <CustomErrorState
              title="Video Temporarily Unavailable"
              message="We're having trouble loading this video. This may be due to network issues or temporary restrictions."
              onRetry={retryCurrentSource}
              onDownload={onDownload}
              showDownload={!!onDownload}
            />
          ) : loading || !videoUrl ? (
            <CustomLoadingState
              progress={loadingProgress}
              onRetry={retryCurrentSource}
              showRetry={loadingProgress > 80}
            />
          ) : (
            <div className="relative w-full h-full">
              {renderPlayer()}

              {/* Custom Video Controls */}
              {playerReady && (
                <VideoControls
                  playing={playing}
                  muted={muted}
                  volume={volume}
                  currentTime={currentTime}
                  duration={duration}
                  showControls={true}
                  onTogglePlay={() => setPlaying(!playing)}
                  onToggleMute={() => setMuted(!muted)}
                  onSeek={handleSeek}
                  onVolumeChange={handleVolumeChange}
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
