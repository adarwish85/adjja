
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
    youTubeAPICallbacks?: (() => void)[];
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
  const retryCountRef = useRef(0);

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
    if (!videoId) return;

    const element = document.getElementById(containerId);
    if (!element) {
      console.log('Container element not found:', containerId);
      setTimeout(createPlayer, 100);
      return;
    }

    try {
      if (playerRef.current) {
        console.log('Destroying existing player');
        playerRef.current.destroy();
        playerRef.current = null;
      }

      console.log('Creating new YouTube player for video:', videoId);
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
          logo: 0,
          color: 'white',
          enablejsapi: 1,
          origin: window.location.origin,
          wmode: 'transparent',
          branding: 0,
          autohide: 1
        },
        events: {
          onReady: (event: any) => {
            console.log('YouTube player ready');
            setIsReady(true);
            setIsLoading(false);
            setError(null);
            retryCountRef.current = 0;
            
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
                errorMessage = 'Invalid video ID. Please check the YouTube URL.';
                break;
              case 5:
                errorMessage = 'Video not available in HTML5 player.';
                break;
              case 100:
                errorMessage = 'Video not found or is private.';
                break;
              case 101:
              case 150:
                errorMessage = 'Video cannot be embedded. Please use a different video.';
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
      setError('Failed to initialize video player. Please try again.');
      setIsLoading(false);
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    }
  }, [videoId, containerId, startTimeTracking, stopTimeTracking]);

  const loadYouTubeAPI = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        console.log('YouTube API already loaded');
        resolve();
        return;
      }

      // Check if API is being loaded
      if (window.youTubeAPIReady) {
        console.log('YouTube API ready');
        resolve();
        return;
      }

      // Add callback to queue
      if (!window.youTubeAPICallbacks) {
        window.youTubeAPICallbacks = [];
      }
      window.youTubeAPICallbacks.push(resolve);

      // Only load script if not already loading
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        console.log('Loading YouTube API');
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onerror = () => {
          console.error('Failed to load YouTube API');
          reject(new Error('Failed to load YouTube API'));
        };
        
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Set up global callback
        window.onYouTubeIframeAPIReady = () => {
          console.log('YouTube API loaded and ready');
          window.youTubeAPIReady = true;
          
          // Execute all queued callbacks
          if (window.youTubeAPICallbacks) {
            window.youTubeAPICallbacks.forEach(callback => callback());
            window.youTubeAPICallbacks = [];
          }
        };
      }
    });
  }, []);

  useEffect(() => {
    if (!videoId) {
      console.log('No video ID provided');
      setIsReady(false);
      setError(null);
      setIsLoading(false);
      return;
    }

    console.log('Initializing YouTube player for video:', videoId);
    setIsLoading(true);
    setError(null);
    setIsReady(false);

    // Set loading timeout
    loadTimeoutRef.current = setTimeout(() => {
      console.log('YouTube player loading timeout');
      setError('Video loading timeout. Please check your internet connection and try again.');
      setIsLoading(false);
    }, 20000); // Increased timeout

    loadYouTubeAPI()
      .then(() => {
        createPlayer();
      })
      .catch((error) => {
        console.error('Failed to load YouTube API:', error);
        setError('Failed to load video player. Please check your internet connection.');
        setIsLoading(false);
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      });

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
  }, [videoId, containerId, loadYouTubeAPI, createPlayer, stopTimeTracking]);

  const play = useCallback(() => {
    if (playerRef.current && isReady) {
      try {
        playerRef.current.playVideo();
      } catch (err) {
        console.error('Error playing video:', err);
        setError('Failed to play video. Please try again.');
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
    if (retryCountRef.current < 3) {
      retryCountRef.current++;
      console.log(`Retrying video load, attempt ${retryCountRef.current}`);
      setError(null);
      setIsLoading(true);
      createPlayer();
    } else {
      setError('Maximum retry attempts reached. Please check the video URL and try again.');
    }
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
