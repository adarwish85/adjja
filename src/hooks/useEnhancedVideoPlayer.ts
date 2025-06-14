
import { useState, useRef, useEffect, useCallback } from 'react';
import { VideoSourceManager, createVideoSourceConfig } from '@/utils/videoSourceManager';

interface VideoPlayerConfig {
  primaryUrl: string;
  fallbackUrls?: string[];
  mp4Urls?: string[];
  maxRetries?: number;
  timeoutDuration?: number;
}

export const useEnhancedVideoPlayer = (config: VideoPlayerConfig, isOpen: boolean) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentPlayerType, setCurrentPlayerType] = useState<'react-player' | 'videojs'>('react-player');
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const sourceManagerRef = useRef<VideoSourceManager | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  const initializeSourceManager = useCallback(() => {
    const sourceConfig = createVideoSourceConfig(
      config.primaryUrl,
      config.fallbackUrls || [],
      config.mp4Urls || []
    );
    sourceManagerRef.current = new VideoSourceManager(sourceConfig);
  }, [config.primaryUrl, config.fallbackUrls, config.mp4Urls]);

  const startLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Simulate loading progress
    setLoadingProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setLoadingProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 200);

    timeoutRef.current = setTimeout(() => {
      console.log('⏰ Loading timeout - trying next source');
      tryNextSource();
    }, config.timeoutDuration || 5000);
  }, [config.timeoutDuration]);

  const clearLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = undefined;
    }
    setLoadingProgress(100);
  }, []);

  const tryNextSource = useCallback(() => {
    if (!sourceManagerRef.current) return;

    const nextSource = sourceManagerRef.current.getNextSource();
    if (nextSource) {
      console.log('🔄 Trying next source:', nextSource);
      setLoading(true);
      setError(null);
      setPlayerReady(false);
      
      // Switch to Video.js for MP4 files
      if (nextSource.type === 'mp4') {
        setCurrentPlayerType('videojs');
      }
      
      startLoadingTimeout();
    } else {
      // All sources exhausted
      setError('Video temporarily unavailable. Please try again later.');
      setLoading(false);
      clearLoadingTimeout();
    }
  }, [startLoadingTimeout, clearLoadingTimeout]);

  const retryCurrentSource = useCallback(() => {
    if (!sourceManagerRef.current) return;

    const retrySource = sourceManagerRef.current.retry();
    if (retrySource) {
      console.log('🔄 Retrying current source');
      setLoading(true);
      setError(null);
      setPlayerReady(false);
      startLoadingTimeout();
    } else {
      tryNextSource();
    }
  }, [startLoadingTimeout, tryNextSource]);

  const resetPlayer = useCallback(() => {
    setPlaying(false);
    setCurrentTime(0);
    setLoading(true);
    setError(null);
    setPlayerReady(false);
    setCurrentPlayerType('react-player');
    setLoadingProgress(0);
    clearLoadingTimeout();
    
    if (sourceManagerRef.current) {
      sourceManagerRef.current.reset();
    }
  }, [clearLoadingTimeout]);

  const getCurrentVideoUrl = useCallback(() => {
    return sourceManagerRef.current?.getObfuscatedUrl() || '';
  }, []);

  const handlePlayerReady = useCallback(() => {
    console.log('✅ Player ready');
    clearLoadingTimeout();
    setPlayerReady(true);
    setLoading(false);
    setError(null);
  }, [clearLoadingTimeout]);

  const handlePlayerError = useCallback((error: any) => {
    console.error('❌ Player error:', error);
    clearLoadingTimeout();
    
    // Try to recover with next source
    setTimeout(() => {
      retryCurrentSource();
    }, 500);
  }, [clearLoadingTimeout, retryCurrentSource]);

  // Initialize when dialog opens
  useEffect(() => {
    if (!isOpen) {
      resetPlayer();
    } else if (config.primaryUrl) {
      initializeSourceManager();
      startLoadingTimeout();
    }

    return () => {
      clearLoadingTimeout();
    };
  }, [isOpen, config.primaryUrl, initializeSourceManager, startLoadingTimeout, clearLoadingTimeout, resetPlayer]);

  return {
    // State
    playing,
    volume,
    muted,
    duration,
    currentTime,
    loading,
    error,
    playerReady,
    currentPlayerType,
    loadingProgress,
    
    // State setters
    setPlaying,
    setVolume,
    setMuted,
    setDuration,
    setCurrentTime,
    
    // Functions
    getCurrentVideoUrl,
    retryCurrentSource,
    resetPlayer,
    handlePlayerReady,
    handlePlayerError,
  };
};
