
import React from 'react';
import { SelfHostedVideoPlayer } from './SelfHostedVideoPlayer';
import { ReliableVideoPlayer } from './ReliableVideoPlayer';
import { isYouTubeUrl } from '@/utils/youtubeUtils';

interface UniversalVideoPlayerProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  poster?: string;
}

export const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
  videoUrl,
  isOpen,
  onClose,
  title,
  poster
}) => {
  // Determine which player to use based on the video URL
  const useYouTubePlayer = isYouTubeUrl(videoUrl);

  if (useYouTubePlayer) {
    return (
      <ReliableVideoPlayer
        videoUrl={videoUrl}
        isOpen={isOpen}
        onClose={onClose}
        title={title}
      />
    );
  }

  return (
    <SelfHostedVideoPlayer
      videoUrl={videoUrl}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      poster={poster}
    />
  );
};
