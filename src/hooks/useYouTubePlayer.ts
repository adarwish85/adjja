
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
  const initTimeoutRef = useRef<NodeJS.Timeout>();

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

  const waitForContainer = useCallback((): Promise<HTMLElement> => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      
      const checkContainer = () => {
        const container = document.getElementById(containerId);
        if (container) {
          console.log('✅ Container found:', containerId);
          resolve(container);
          return;
        }
        
        attempts++;
        if (attempts >= maxAttempts) {
          console.error('❌ Container not found after', maxAttempts, 'attempts');
          reject(new Error(`Container ${containerId} not found`));
          return;
        }
        
        setTimeout(checkContainer, 100);
      };
      
      checkContainer();
    });
  }, [containerId]);

  const loadYouTubeAPI = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.YT && window.YT.Player) {
        console.log('✅ YouTube API already loaded');
        resolve();
        return;
      }

      console.log('🔄 Loading YouTube API...');
      
      const timeout = setTimeout(() => {
        console.error('❌ YouTube API loading timeout');
        reject(new Error('YouTube API loading timeout'));
      }, 10000);

      window.onYouTubeIframeAPIReady = () => {
        clearTimeout(timeout);
        console.log('✅ YouTube API loaded successfully');
        resolve();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Failed to load YouTube API script'));
        };
        document.head.appendChild(script);
      }
    });
  }, []);

  const createPlayer = useCallback(async () => {
    if (!videoId) {
      console.log('❌ No video ID provided');
      return;
    }

    console.log('🎬 Creating player for video:', videoId);
    setIsLoading(true);
    setError(null);

    try {
      // Wait for API and container
      await loadYouTubeAPI();
      const container = await waitForContainer();

      // Clear existing player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (err) {
          console.warn('Error destroying existing player:', err);
        }
        playerRef.current = null;
      }

      // Clear container
      container.innerHTML = '';

      // Set initialization timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      initTimeoutRef.current = setTimeout(() => {
        console.error('❌ Player initialization timeout');
        setError('Video loading timeout. Please try again.');
        setIsLoading(false);
      }, 15000);

      console.log('🔧 Initializing YouTube player...');
      
      playerRef.current = new window.YT.Player(containerId, {
        height: '100%',
        width: '100%',
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
            console.log('✅ YouTube player ready');
            if (initTimeoutRef.current) {
              clearTimeout(initTimeoutRef.current);
            }
            setIsReady(true);
            setIsLoading(false);
            setError(null);
            
            try {
              const player = event.target;
              setDuration(player.getDuration());
              setVolumeState(player.getVolume());
              setIsMuted(player.isMuted());
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
            console.error('❌ YouTube player error:', event.data);
            if (initTimeoutRef.current) {
              clearTimeout(initTimeoutRef.current);
            }
            
            let errorMessage = 'Video playback error';
            
            switch (event.data) {
              case 2:
                errorMessage = 'Invalid video ID';
                break;
              case 5:
                errorMessage = 'Video not available in your region';
                break;
              case 100:
                errorMessage = 'Video not found or private';
                break;
              case 101:
              case 150:
                errorMessage = 'Video cannot be embedded';
                break;
              default:
                errorMessage = 'Video loading failed. Please try again.';
            }
            
            setError(errorMessage);
            setIsLoading(false);
            setIsReady(false);
          },
        },
      });
    } catch (err) {
      console.error('❌ Error creating player:', err);
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      setError('Failed to initialize video player');
      setIsLoading(false);
    }
  }, [videoId, containerId, loadYouTubeAPI, waitForContainer, startTimeTracking, stopTimeTracking]);

  const retryLoad = useCallback(() => {
    console.log('🔄 Retrying video load...');
    setError(null);
    setIsReady(false);
    createPlayer();
  }, [createPlayer]);

  useEffect(() => {
    if (!videoId) {
      console.log('No video ID, clearing player state');
      setIsReady(false);
      setError(null);
      setIsLoading(false);
      return;
    }

    console.log('🚀 Initializing player for video:', videoId);
    createPlayer();

    return () => {
      console.log('🧹 Cleaning up player');
      stopTimeTracking();
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (err) {
          console.error('Error destroying player:', err);
        }
        playerRef.current = null;
      }
    };
  }, [videoId, createPlayer, stopTimeTracking]);

  return {
    isReady,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    error,
    isLoading,
    play: useCallback(() => {
      if (playerRef.current && isReady) {
        try {
          playerRef.current.playVideo();
        } catch (err) {
          console.error('Error playing video:', err);
        }
      }
    }, [isReady]),
    pause: useCallback(() => {
      if (playerRef.current && isReady) {
        try {
          playerRef.current.pauseVideo();
        } catch (err) {
          console.error('Error pausing video:', err);
        }
      }
    }, [isReady]),
    seekTo: useCallback((seconds: number) => {
      if (playerRef.current && isReady) {
        try {
          playerRef.current.seekTo(seconds);
          setCurrentTime(seconds);
        } catch (err) {
          console.error('Error seeking video:', err);
        }
      }
    }, [isReady]),
    setVolume: useCallback((vol: number) => {
      if (playerRef.current && isReady) {
        try {
          playerRef.current.setVolume(vol);
          setVolumeState(vol);
          setIsMuted(vol === 0);
        } catch (err) {
          console.error('Error setting volume:', err);
        }
      }
    }, [isReady]),
    toggleMute: useCallback(() => {
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
    }, [isReady, isMuted]),
    retryLoad,
  };
};
