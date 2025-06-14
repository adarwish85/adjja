interface VideoSource {
  url: string;
  type: 'mp4' | 'hls' | 'dash' | 'youtube';
  quality?: string;
}

interface VideoSourceConfig {
  primary: VideoSource;
  fallbacks: VideoSource[];
  preloadStrategy?: 'metadata' | 'auto' | 'none';
}

export class VideoSourceManager {
  private sources: VideoSource[] = [];
  private currentSourceIndex = 0;
  private maxRetries = 1; // Reduced retries for YouTube
  private currentRetries = 0;

  constructor(private config: VideoSourceConfig) {
    this.sources = [config.primary, ...config.fallbacks];
    console.log('📹 VideoSourceManager initialized with sources:', this.sources);
  }

  getCurrentSource(): VideoSource | null {
    return this.sources[this.currentSourceIndex] || null;
  }

  getNextSource(): VideoSource | null {
    if (this.currentSourceIndex < this.sources.length - 1) {
      this.currentSourceIndex++;
      this.currentRetries = 0;
      console.log('🔄 Switching to next source:', this.getCurrentSource());
      return this.getCurrentSource();
    }
    return null;
  }

  canRetry(): boolean {
    const current = this.getCurrentSource();
    // For YouTube videos, be more lenient with retries
    if (current?.type === 'youtube') {
      return this.currentRetries < 1;
    }
    return this.currentRetries < this.maxRetries;
  }

  retry(): VideoSource | null {
    if (this.canRetry()) {
      this.currentRetries++;
      console.log('🔄 Retrying current source:', this.getCurrentSource());
      return this.getCurrentSource();
    }
    return this.getNextSource();
  }

  reset(): void {
    this.currentSourceIndex = 0;
    this.currentRetries = 0;
    console.log('🔄 VideoSourceManager reset');
  }

  getObfuscatedUrl(): string {
    const current = this.getCurrentSource();
    if (!current) return '';
    
    // For YouTube, return the cleaned URL
    if (current.type === 'youtube') {
      return this.cleanYouTubeUrl(current.url);
    }
    
    return current.url;
  }

  // Clean and validate YouTube URLs
  private cleanYouTubeUrl(url: string): string {
    if (!url) return '';
    
    try {
      // Handle different YouTube URL formats
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
      }
      
      if (url.includes('youtube.com/watch')) {
        // Clean URL but keep essential parameters
        const urlObj = new URL(url);
        const videoId = urlObj.searchParams.get('v');
        const time = urlObj.searchParams.get('t');
        
        if (videoId) {
          let cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
          if (time) cleanUrl += `&t=${time}`;
          return cleanUrl;
        }
      }
      
      if (url.includes('youtube.com/embed/')) {
        const videoId = url.split('youtube.com/embed/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/watch?v=${videoId}` : url;
      }
      
      return url;
    } catch (error) {
      console.warn('Error cleaning YouTube URL:', error);
      return url;
    }
  }

  isYouTubeSource(): boolean {
    const current = this.getCurrentSource();
    return current?.type === 'youtube';
  }

  getPreferredPlayerType(): 'react-player' | 'videojs' {
    const current = this.getCurrentSource();
    if (!current) return 'react-player';
    
    // Always use ReactPlayer for YouTube - it handles YouTube better
    return current.type === 'youtube' ? 'react-player' : 'videojs';
  }
}

export const createVideoSourceConfig = (
  primaryUrl: string,
  fallbackUrls: string[] = [],
  mp4Urls: string[] = []
): VideoSourceConfig => {
  const getPrimaryType = (url: string): VideoSource['type'] => {
    if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('.m3u8')) return 'hls';
    if (url.includes('.mpd')) return 'dash';
    return 'mp4';
  };

  const primary: VideoSource = {
    url: primaryUrl,
    type: getPrimaryType(primaryUrl)
  };

  // For YouTube videos, don't add MP4 fallbacks as they likely don't exist
  const fallbacks: VideoSource[] = [
    ...fallbackUrls.map(url => ({
      url,
      type: getPrimaryType(url)
    })),
    // Only add MP4 URLs if primary is not YouTube
    ...(primary.type !== 'youtube' ? mp4Urls.filter(url => url && url.trim()).map(url => ({
      url,
      type: 'mp4' as const,
      quality: url.includes('720p') ? '720p' : url.includes('480p') ? '480p' : 'auto'
    })) : [])
  ];

  return {
    primary,
    fallbacks,
    preloadStrategy: 'metadata'
  };
};
