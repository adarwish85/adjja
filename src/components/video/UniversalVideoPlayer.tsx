
import React from 'react';
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
  // For now, we'll primarily use YouTube player since that's what we're focusing on
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

  // For non-YouTube URLs, show a message or fallback
  return (
    <ReliableVideoPlayer
      videoUrl={videoUrl}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    />
  );
};
