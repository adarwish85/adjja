
import { useEffect, useRef, useState, useCallback } from 'react';

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
    youTubeAPIReady?: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeTrackingRef = useRef<number>();

  const startTimeTracking = useCallback(() => {
    if (timeTrackingRef.current) {
      cancelAnimationFrame(timeTrackingRef.current);
    }
    
    const updateTime = () => {
      if (playerRef.current) {
        try {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(time);
          timeTrackingRef.current = requestAnimationFrame(updateTime);
        } catch (err) {
          console.error('Error updating time:', err);
        }
      }
    };
    
    timeTrackingRef.current = requestAnimationFrame(updateTime);
  }, []);

  const stopTimeTracking = useCallback(() => {
    if (timeTrackingRef.current) {
      cancelAnimationFrame(timeTrackingRef.current);
      timeTrackingRef.current = undefined;
    }
  }, []);

  const createPlayer = useCallback(() => {
    if (!videoId || !window.YT) return;

    const element = document.getElementById(containerId);
    if (!element) {
      console.log('Container element not found:', containerId);
      return;
    }

    try {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      console.log('Creating YouTube player for video:', videoId);
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
          showinfo: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready');
            setIsReady(true);
            setIsLoading(false);
            setError(null);
            
            try {
              setDuration(event.target.getDuration());
              setVolumeState(event.target.getVolume());
              setIsMuted(event.target.isMuted());
            } catch (err) {
              console.error('Error getting player properties:', err);
            }
          },
          onStateChange: (event: any) => {
            const state = event.data;
            const playing = state === window.YT.PlayerState.PLAYING;
            setIsPlaying(playing);
            
            if (playing) {
              startTimeTracking();
            } else {
              stopTimeTracking();
            }
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data);
            let errorMessage = 'Video playback error';
            
            switch (event.data) {
              case 2:
                errorMessage = 'Invalid video ID';
                break;
              case 5:
                errorMessage = 'Video not available';
                break;
              case 100:
                errorMessage = 'Video not found or private';
                break;
              case 101:
              case 150:
                errorMessage = 'Video cannot be embedded';
                break;
            }
            
            setError(errorMessage);
            setIsLoading(false);
          },
        },
      });
    } catch (err) {
      console.error('Error creating YouTube player:', err);
      setError('Failed to initialize video player');
      setIsLoading(false);
    }
  }, [videoId, containerId, startTimeTracking, stopTimeTracking]);

  const loadYouTubeAPI = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      if (window.youTubeAPIReady) {
        resolve();
        return;
      }

      window.onYouTubeIframeAPIReady = () => {
        window.youTubeAPIReady = true;
        resolve();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    });
  }, []);

  useEffect(() => {
    if (!videoId) {
      setIsReady(false);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsReady(false);

    loadYouTubeAPI().then(() => {
      createPlayer();
    });

    return () => {
      stopTimeTracking();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (err) {
          console.error('Error destroying player:', err);
        }
      }
    };
  }, [videoId, containerId, loadYouTubeAPI, createPlayer, stopTimeTracking]);

  const play = useCallback(() => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.playVideo();
      } catch (err) {
        console.error('Error playing video:', err);
      }
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.pauseVideo();
      } catch (err) {
        console.error('Error pausing video:', err);
      }
    }
  }, [isReady]);

  const seekTo = useCallback((seconds: number) => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.seekTo(seconds);
        setCurrentTime(seconds);
      } catch (err) {
        console.error('Error seeking video:', err);
      }
    }
  }, [isReady]);

  const setVolume = useCallback((vol: number) => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.setVolume(vol);
        setVolumeState(vol);
        setIsMuted(vol === 0);
      } catch (err) {
        console.error('Error setting volume:', err);
      }
    }
  }, [isReady]);

  const toggleMute = useCallback(() => {
    if (playerRef.current && isReady) {
      try {
        if (isMuted) {
          playerRef.current.unMute();
          setIsMuted(false);
        } else {
          playerRef.current.mute();
          setIsMuted(true);
        }
      } catch (err) {
        console.error('Error toggling mute:', err);
      }
    }
  }, [isReady, isMuted]);

  const retryLoad = useCallback(() => {
    setError(null);
    setIsLoading(true);
    createPlayer();
  }, [createPlayer]);

  return {
    isReady,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    error,
    isLoading,
    play,
    pause,
    seekTo,
    setVolume,
    toggleMute,
    retryLoad,
  };
};
