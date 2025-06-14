
import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { cleanYouTubeUrl, getCleanEmbedUrl, checkVideoAvailability } from '@/utils/youtubeUtils';

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
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{
    available: boolean;
    embeddable: boolean;
    error?: string;
  } | null>(null);
  
  const playerRef = useRef<ReactPlayer>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  const startLoadingTimeout = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      console.log('⏰ Loading timeout reached for:', processedUrl);
      setLoadingTimeout(true);
      setError('Video is taking too long to load. The video may have embedding restrictions.');
      setLoading(false);
    }, 6000); // Reduced from 10 seconds to 6 seconds
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
    setValidationResult(null);
    clearLoadingTimeout();
  };

  const processAndValidateUrl = async (url: string) => {
    if (!url) return;

    console.log('🔍 Processing URL:', url);
    
    // Clean and process the URL
    const cleaned = cleanYouTubeUrl(url);
    const processed = getCleanEmbedUrl(cleaned);
    setProcessedUrl(processed);
    
    console.log('✨ Processed URL:', processed);

    // Pre-validate YouTube videos
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      try {
        const validation = await checkVideoAvailability(url);
        setValidationResult(validation);
        
        if (!validation.available) {
          setError(validation.error || 'Video is not available');
          setLoading(false);
          return;
        }
        
        if (!validation.embeddable) {
          setError('This video cannot be embedded. Please open it directly in YouTube.');
          setLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Pre-validation failed, proceeding with direct loading:', error);
      }
    }

    // Start loading timeout after URL processing
    startLoadingTimeout();
  };

  // Reset states when dialog closes or video changes
  useEffect(() => {
    if (!isOpen) {
      resetStates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (videoUrl && isOpen) {
      console.log('🎬 New video URL:', videoUrl);
      resetStates();
      processAndValidateUrl(videoUrl);
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
    processedUrl,
    validationResult,
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
