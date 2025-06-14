
interface VideoSource {
  url: string;
  type: 'youtube' | 'mp4' | 'hls' | 'dash';
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
    this.sources = [config.primary, ...config.fallbacks];
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

  // Obfuscate YouTube URLs to remove branding
  private obfuscateYouTubeUrl(url: string): string {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = this.extractVideoId(url);
      if (videoId) {
        // Use nocookie domain and disable all YouTube UI
        return `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&playsinline=1&origin=${window.location.origin}&enablejsapi=0`;
      }
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
    
    if (current.type === 'youtube') {
      return this.obfuscateYouTubeUrl(current.url);
    }
    return current.url;
  }
}

export const createVideoSourceConfig = (
  primaryUrl: string,
  fallbackUrls: string[] = [],
  mp4Urls: string[] = []
): VideoSourceConfig => {
  const primary: VideoSource = {
    url: primaryUrl,
    type: primaryUrl.includes('youtube') ? 'youtube' : 'mp4'
  };

  const fallbacks: VideoSource[] = [
    ...fallbackUrls.map(url => ({
      url,
      type: url.includes('youtube') ? 'youtube' as const : 'mp4' as const
    })),
    ...mp4Urls.map(url => ({
      url,
      type: 'mp4' as const
    }))
  ];

  return {
    primary,
    fallbacks,
    preloadStrategy: 'metadata'
  };
};
