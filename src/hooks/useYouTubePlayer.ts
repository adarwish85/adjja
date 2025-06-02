
import { useEffect, useRef, useState } from 'react';

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getVolume: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const useYouTubePlayer = (videoId: string | null, containerId: string) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!videoId) return;

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    };

    const initializePlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          fs: 0,
          disablekb: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            setDuration(event.target.getDuration());
            setVolumeState(event.target.getVolume());
            setIsMuted(event.target.isMuted());
          },
          onStateChange: (event: any) => {
            const state = event.data;
            setIsPlaying(state === window.YT.PlayerState.PLAYING);
            
            if (state === window.YT.PlayerState.PLAYING) {
              startTimeTracking();
            }
          },
        },
      });
    };

    const startTimeTracking = () => {
      const updateTime = () => {
        if (playerRef.current && isPlaying) {
          setCurrentTime(playerRef.current.getCurrentTime());
          requestAnimationFrame(updateTime);
        }
      };
      requestAnimationFrame(updateTime);
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId, containerId]);

  const play = () => {
    if (playerRef.current && isReady) {
      playerRef.current.playVideo();
    }
  };

  const pause = () => {
    if (playerRef.current && isReady) {
      playerRef.current.pauseVideo();
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current && isReady) {
      playerRef.current.seekTo(seconds);
      setCurrentTime(seconds);
    }
  };

  const setVolume = (vol: number) => {
    if (playerRef.current && isReady) {
      playerRef.current.setVolume(vol);
      setVolumeState(vol);
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (playerRef.current && isReady) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  return {
    isReady,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    play,
    pause,
    seekTo,
    setVolume,
    toggleMute,
  };
};
