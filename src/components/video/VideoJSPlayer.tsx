
import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/sea-green/index.css';

interface VideoJSPlayerProps {
  src: string;
  poster?: string;
  onReady?: () => void;
  onError?: (error: any) => void;
  onProgress?: (currentTime: number) => void;
  onDuration?: (duration: number) => void;
  playing?: boolean;
  volume?: number;
  muted?: boolean;
  className?: string;
}

export const VideoJSPlayer: React.FC<VideoJSPlayerProps> = ({
  src,
  poster,
  onReady,
  onError,
  onProgress,
  onDuration,
  playing = false,
  volume = 1,
  muted = false,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Video.js player
    playerRef.current = videojs(videoRef.current, {
      controls: true,
      responsive: true,
      fluid: true,
      preload: 'metadata',
      poster: poster,
      sources: [{
        src: src,
        type: src.includes('.mp4') ? 'video/mp4' : 'application/x-mpegURL'
      }],
      techOrder: ['html5'],
      html5: {
        vhs: {
          overrideNative: true
        }
      }
    });

    const player = playerRef.current;

    player.ready(() => {
      setIsReady(true);
      onReady?.();
    });

    player.on('error', (error: any) => {
      console.error('Video.js error:', error);
      onError?.(error);
    });

    player.on('timeupdate', () => {
      onProgress?.(player.currentTime());
    });

    player.on('loadedmetadata', () => {
      onDuration?.(player.duration());
    });

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  // Handle playing state
  useEffect(() => {
    if (!isReady || !playerRef.current) return;

    if (playing) {
      playerRef.current.play().catch((error: any) => {
        console.warn('Autoplay failed:', error);
      });
    } else {
      playerRef.current.pause();
    }
  }, [playing, isReady]);

  // Handle volume changes
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    playerRef.current.volume(volume);
  }, [volume, isReady]);

  // Handle mute changes
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    playerRef.current.muted(muted);
  }, [muted, isReady]);

  return (
    <div className={`video-js-container ${className}`}>
      <video
        ref={videoRef}
        className="video-js vjs-theme-sea-green vjs-big-play-centered"
        data-setup="{}"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
