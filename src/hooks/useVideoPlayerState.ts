
import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

export const useVideoPlayerState = (videoUrl: string, isOpen: boolean) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  const playerRef = useRef<ReactPlayer>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  const startLoadingTimeout = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      console.log('⏰ Loading timeout reached for:', videoUrl);
      setLoadingTimeout(true);
      setError('Video is taking too long to load. Please try again or open externally.');
      setLoading(false);
    }, 10000);
  };

  const clearLoadingTimeout = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = undefined;
    }
  };

  const resetStates = () => {
    setPlaying(false);
    setCurrentTime(0);
    setLoading(true);
    setError(null);
    setPlayerReady(false);
    setLoadingTimeout(false);
    clearLoadingTimeout();
  };

  // Reset states when dialog closes or video changes
  useEffect(() => {
    if (!isOpen) {
      resetStates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (videoUrl && isOpen) {
      console.log('Video URL changed:', videoUrl);
      setLoading(true);
      setError(null);
      setPlayerReady(false);
      setPlaying(false);
      setLoadingTimeout(false);
      startLoadingTimeout();
    }

    return () => {
      clearLoadingTimeout();
    };
  }, [videoUrl, isOpen]);

  return {
    // State
    playing,
    volume,
    muted,
    duration,
    currentTime,
    showControls,
    loading,
    error,
    playerReady,
    loadingTimeout,
    playerRef,
    controlsTimeoutRef,
    
    // State setters
    setPlaying,
    setVolume,
    setMuted,
    setDuration,
    setCurrentTime,
    setShowControls,
    setLoading,
    setError,
    setPlayerReady,
    setLoadingTimeout,
    
    // Utility functions
    startLoadingTimeout,
    clearLoadingTimeout,
    resetStates,
  };
};
