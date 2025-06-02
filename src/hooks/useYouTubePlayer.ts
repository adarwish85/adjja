
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeTrackingRef = useRef<number>();
  const loadTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!videoId) {
      console.log('No video ID provided');
      return;
    }

    console.log('Initializing YouTube player for video:', videoId);
    setIsLoading(true);
    setError(null);

    // Set loading timeout
    loadTimeoutRef.current = setTimeout(() => {
      console.log('YouTube player loading timeout');
      setError('Video loading timeout. Please try again.');
      setIsLoading(false);
    }, 15000);

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        console.log('YouTube API already loaded');
        initializePlayer();
        return;
      }

      console.log('Loading YouTube API');
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onerror = () => {
        console.error('Failed to load YouTube API');
        setError('Failed to load video player. Please check your internet connection.');
        setIsLoading(false);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
      
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API ready');
        initializePlayer();
      };
    };

    const initializePlayer = () => {
      // Wait for DOM element to be available
      const checkElement = () => {
        const element = document.getElementById(containerId);
        if (!element) {
          console.log('Container element not found, retrying...');
          setTimeout(checkElement, 100);
          return;
        }

        console.log('Container element found, initializing player');
        createPlayer();
      };

      const createPlayer = () => {
        try {
          if (playerRef.current) {
            console.log('Destroying existing player');
            playerRef.current.destroy();
          }

          console.log('Creating new YouTube player');
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
                console.log('YouTube player ready');
                setIsReady(true);
                setIsLoading(false);
                if (loadTimeoutRef.current) {
                  clearTimeout(loadTimeoutRef.current);
                }
                
                try {
                  setDuration(event.target.getDuration());
                  setVolumeState(event.target.getVolume());
                  setIsMuted(event.target.isMuted());
                } catch (err) {
                  console.error('Error getting player properties:', err);
                }
              },
              onStateChange: (event: any) => {
                console.log('YouTube player state changed:', event.data);
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
                    errorMessage = 'Video not available in HTML5 player';
                    break;
                  case 100:
                    errorMessage = 'Video not found or private';
                    break;
                  case 101:
                  case 150:
                    errorMessage = 'Video not available for embedded playback';
                    break;
                }
                
                setError(errorMessage);
                setIsLoading(false);
                if (loadTimeoutRef.current) {
                  clearTimeout(loadTimeoutRef.current);
                }
              },
            },
          });
        } catch (err) {
          console.error('Error creating YouTube player:', err);
          setError('Failed to initialize video player');
          setIsLoading(false);
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
        }
      };

      checkElement();
    };

    const startTimeTracking = () => {
      stopTimeTracking(); // Clear any existing tracking
      
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
    };

    const stopTimeTracking = () => {
      if (timeTrackingRef.current) {
        cancelAnimationFrame(timeTrackingRef.current);
        timeTrackingRef.current = undefined;
      }
    };

    loadYouTubeAPI();

    return () => {
      console.log('Cleaning up YouTube player');
      stopTimeTracking();
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (err) {
          console.error('Error destroying player:', err);
        }
      }
    };
  }, [videoId, containerId]);

  const play = () => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.playVideo();
      } catch (err) {
        console.error('Error playing video:', err);
      }
    }
  };

  const pause = () => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.pauseVideo();
      } catch (err) {
        console.error('Error pausing video:', err);
      }
    }
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.seekTo(seconds);
        setCurrentTime(seconds);
      } catch (err) {
        console.error('Error seeking video:', err);
      }
    }
  };

  const setVolume = (vol: number) => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.setVolume(vol);
        setVolumeState(vol);
        setIsMuted(vol === 0);
      } catch (err) {
        console.error('Error setting volume:', err);
      }
    }
  };

  const toggleMute = () => {
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
  };

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
  };
};
