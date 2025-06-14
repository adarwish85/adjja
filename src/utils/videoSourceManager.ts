
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
  private maxRetries = 3;
  private currentRetries = 0;

  constructor(private config: VideoSourceConfig) {
    // Prioritize MP4 sources over YouTube
    this.sources = this.prioritizeSources([config.primary, ...config.fallbacks]);
  }

  private prioritizeSources(sources: VideoSource[]): VideoSource[] {
    // Sort sources to prioritize MP4, then HLS/DASH, then YouTube as last resort
    return sources.sort((a, b) => {
      const priority = { mp4: 0, hls: 1, dash: 2, youtube: 3 };
      return priority[a.type] - priority[b.type];
    });
  }

  getCurrentSource(): VideoSource | null {
    return this.sources[this.currentSourceIndex] || null;
  }

  getNextSource(): VideoSource | null {
    if (this.currentSourceIndex < this.sources.length - 1) {
      this.currentSourceIndex++;
      this.currentRetries = 0;
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
      return this.getCurrentSource();
    }
    return this.getNextSource();
  }

  reset(): void {
    this.currentSourceIndex = 0;
    this.currentRetries = 0;
  }

  // Generate CDN URLs for video sources
  private generateCDNUrl(originalUrl: string, quality?: string): string {
    // In a real implementation, this would generate your CDN URLs
    // For now, return the original URL
    return originalUrl;
  }

  // Obfuscate video URLs to remove external branding
  private obfuscateVideoUrl(url: string): string {
    const current = this.getCurrentSource();
    if (!current) return url;

    switch (current.type) {
      case 'youtube':
        // For YouTube sources, use nocookie embed with minimal UI
        const videoId = this.extractVideoId(url);
        if (videoId) {
          return `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1&fs=1&iv_load_policy=3&cc_load_policy=0&playsinline=1&origin=${window.location.origin}`;
        }
        break;
      case 'mp4':
      case 'hls':
      case 'dash':
        // For direct video files, return as-is or apply CDN transformation
        return this.generateCDNUrl(url, current.quality);
      default:
        break;
    }
    
    return url;
  }

  private extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }

  getObfuscatedUrl(): string {
    const current = this.getCurrentSource();
    if (!current) return '';
    
    return this.obfuscateVideoUrl(current.url);
  }

  // Check if current source is a YouTube source
  isYouTubeSource(): boolean {
    const current = this.getCurrentSource();
    return current?.type === 'youtube';
  }

  // Get preferred player type for current source
  getPreferredPlayerType(): 'react-player' | 'videojs' {
    const current = this.getCurrentSource();
    if (!current) return 'videojs';
    
    // Use Video.js for MP4, HLS, DASH sources
    // Use ReactPlayer only for YouTube as fallback
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

  // Create fallback sources, prioritizing MP4s
  const fallbacks: VideoSource[] = [
    // Add MP4 URLs first (highest priority)
    ...mp4Urls.map(url => ({
      url,
      type: 'mp4' as const,
      quality: url.includes('720p') ? '720p' : url.includes('480p') ? '480p' : 'auto'
    })),
    // Then add other fallback URLs
    ...fallbackUrls.map(url => ({
      url,
      type: getPrimaryType(url)
    }))
  ];

  return {
    primary,
    fallbacks,
    preloadStrategy: 'metadata'
  };
};
