// Enhanced YouTube utilities with URL cleaning and validation
export const cleanYouTubeUrl = (url: string): string => {
  if (!url) return url;
  
  try {
    const urlObj = new URL(url.trim());
    
    // Remove tracking parameters
    const paramsToRemove = ['si', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];
    paramsToRemove.forEach(param => urlObj.searchParams.delete(param));
    
    return urlObj.toString();
  } catch (error) {
    console.warn('Invalid URL format:', url);
    return url;
  }
};

export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Clean the URL first
  const cleanUrl = cleanYouTubeUrl(url);
  
  // Enhanced regex patterns with better validation
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(?:&.*)?/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:\?.*)?/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})(?:\?.*)?/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\?.*)?/,
    /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})(?:&.*)?/,
  ];
  
  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      // Validate video ID format (exactly 11 characters, alphanumeric + - and _)
      if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        console.log('Extracted video ID:', videoId);
        return videoId;
      }
    }
  }
  
  console.warn('Could not extract valid video ID from URL:', url);
  return null;
};

export const getCleanEmbedUrl = (url: string): string => {
  const videoId = extractYouTubeVideoId(url);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return cleanYouTubeUrl(url);
};

export const isValidYouTubeUrl = (url: string): boolean => {
  const videoId = extractYouTubeVideoId(url);
  return videoId !== null;
};

export const getYouTubeThumbnail = (url: string): string => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
};

export const checkVideoAvailability = async (url: string): Promise<{
  available: boolean;
  embeddable: boolean;
  error?: string;
}> => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return { available: false, embeddable: false, error: 'Invalid YouTube URL' };
  }

  try {
    // Check if video exists and is embeddable using oEmbed
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    
    if (response.ok) {
      return { available: true, embeddable: true };
    } else if (response.status === 404) {
      return { available: false, embeddable: false, error: 'Video not found or is private' };
    } else if (response.status === 401) {
      return { available: true, embeddable: false, error: 'Video cannot be embedded' };
    } else {
      return { available: false, embeddable: false, error: 'Video unavailable' };
    }
  } catch (error) {
    console.error('Error checking video availability:', error);
    return { available: false, embeddable: false, error: 'Unable to verify video' };
  }
};

export const fetchYouTubeVideoInfo = async (videoId: string): Promise<{
  title: string;
  duration: number;
} | null> => {
  try {
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      throw new Error('Invalid video ID format');
    }

    const oEmbedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    
    if (!oEmbedResponse.ok) {
      if (oEmbedResponse.status === 404) {
        throw new Error('Video not found or is private');
      }
      throw new Error('Failed to fetch video info');
    }
    
    const oEmbedData = await oEmbedResponse.json();
    
    return {
      title: oEmbedData.title || 'Untitled Video',
      duration: 10 // Default duration
    };
  } catch (error) {
    console.error('Error fetching YouTube video info:', error);
    throw error;
  }
};

export const generateCourseSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const validateYouTubeUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url.trim()) {
    return { isValid: false, error: 'Please enter a YouTube URL' };
  }

  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return { 
      isValid: false, 
      error: 'Invalid YouTube URL. Please use a valid YouTube video link.' 
    };
  }

  return { isValid: true };
};
