
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoControlsProps {
  playing: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  showControls: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFullscreen: () => void;
  formatTime: (time: number) => string;
}

export const VideoControls = ({
  playing,
  muted,
  volume,
  currentTime,
  duration,
  showControls,
  onTogglePlay,
  onToggleMute,
  onSeek,
  onVolumeChange,
  onFullscreen,
  formatTime,
}: VideoControlsProps) => {
  return (
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
          onChange={onSeek}
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
            onClick={onTogglePlay}
            className="text-white hover:bg-gray-700 p-3"
          >
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleMute}
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
              onChange={onVolumeChange}
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
          onClick={onFullscreen}
          className="text-white hover:bg-gray-700 p-2"
        >
          <Maximize className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
