
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
  const errorTimeoutRef = useRef<NodeJS.Timeout>();

  const initializeSourceManager = useCallback(() => {
    console.log('🚀 Initializing source manager with URL:', config.primaryUrl);
    
    const sourceConfig = createVideoSourceConfig(
      config.primaryUrl,
      config.fallbackUrls || [],
      config.mp4Urls || []
    );
    sourceManagerRef.current = new VideoSourceManager(sourceConfig);
    
    if (sourceManagerRef.current) {
      const preferredType = sourceManagerRef.current.getPreferredPlayerType();
      console.log('🎮 Setting player type to:', preferredType);
      setCurrentPlayerType(preferredType);
    }
  }, [config.primaryUrl, config.fallbackUrls, config.mp4Urls]);

  const startLoadingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoadingProgress(0);
    progressIntervalRef.current = setInterval(() => {
      setLoadingProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 500);

    // Longer timeout for YouTube videos to allow for proper loading
    const timeout = sourceManagerRef.current?.isYouTubeSource() ? 15000 : (config.timeoutDuration || 10000);
    
    timeoutRef.current = setTimeout(() => {
      console.log('⏰ Loading timeout - trying next source or showing error');
      tryNextSource();
    }, timeout);
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
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = undefined;
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
      setCurrentPlayerType(sourceManagerRef.current.getPreferredPlayerType());
      startLoadingTimeout();
    } else {
      // All sources exhausted - for YouTube videos, show a more specific error
      const isYouTube = sourceManagerRef.current.isYouTubeSource();
      console.error('❌ All video sources exhausted, isYouTube:', isYouTube);
      
      if (isYouTube) {
        setError('This YouTube video cannot be embedded. It may be restricted by the content owner or unavailable in your region.');
      } else {
        setError('Video content is temporarily unavailable. Please try again later.');
      }
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
      setCurrentPlayerType(sourceManagerRef.current.getPreferredPlayerType());
      startLoadingTimeout();
    } else {
      tryNextSource();
    }
  }, [startLoadingTimeout, tryNextSource]);

  const resetPlayer = useCallback(() => {
    console.log('🔄 Resetting player');
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
    const url = sourceManagerRef.current?.getObfuscatedUrl() || '';
    console.log('🎥 Current video URL:', url);
    return url;
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
    
    // For YouTube errors, give a short delay before retrying
    errorTimeoutRef.current = setTimeout(() => {
      const isYouTube = sourceManagerRef.current?.isYouTubeSource();
      if (isYouTube) {
        // YouTube specific error handling
        console.log('YouTube video error, trying to recover...');
        retryCurrentSource();
      } else {
        retryCurrentSource();
      }
    }, 2000);
  }, [clearLoadingTimeout, retryCurrentSource]);

  // Initialize when dialog opens
  useEffect(() => {
    if (!isOpen) {
      resetPlayer();
    } else if (config.primaryUrl) {
      console.log('🎬 Opening video player with URL:', config.primaryUrl);
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
