
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
  private maxRetries = 2;
  private currentRetries = 0;

  constructor(private config: VideoSourceConfig) {
    // For YouTube sources, don't prioritize over MP4 - use as provided
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

  // Get the current video URL without obfuscation for YouTube
  getObfuscatedUrl(): string {
    const current = this.getCurrentSource();
    if (!current) return '';
    
    // For YouTube, return the original URL - ReactPlayer handles it properly
    if (current.type === 'youtube') {
      return current.url;
    }
    
    // For other types, return as-is
    return current.url;
  }

  // Check if current source is a YouTube source
  isYouTubeSource(): boolean {
    const current = this.getCurrentSource();
    return current?.type === 'youtube';
  }

  // Get preferred player type for current source
  getPreferredPlayerType(): 'react-player' | 'videojs' {
    const current = this.getCurrentSource();
    if (!current) return 'react-player';
    
    // Use ReactPlayer for YouTube sources as it handles them better
    // Use Video.js for direct video files
    return current.type === 'youtube' ? 'react-player' : 'videojs';
  }
}

export const createVideoSourceConfig = (
  primaryUrl: string,
  fallbackUrls: string[] = [],
  mp4Urls: string[] = []
): VideoSourceConfig => {
  // Determine primary source type
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

  // Create fallback sources
  const fallbacks: VideoSource[] = [
    // Add other fallback URLs
    ...fallbackUrls.map(url => ({
      url,
      type: getPrimaryType(url)
    })),
    // Add MP4 URLs as additional fallbacks only if they exist
    ...mp4Urls.filter(url => url && url.trim()).map(url => ({
      url,
      type: 'mp4' as const,
      quality: url.includes('720p') ? '720p' : url.includes('480p') ? '480p' : 'auto'
    }))
  ];

  return {
    primary,
    fallbacks,
    preloadStrategy: 'metadata'
  };
};
