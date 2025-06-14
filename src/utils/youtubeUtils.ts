
// Utility functions for YouTube video integration
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  // Clean the URL
  const cleanUrl = url.trim();
  
  // Enhanced regex to handle more YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/.*[?&]v=)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      // Validate video ID format (11 characters, alphanumeric + - and _)
      const videoId = match[1];
      if (/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return videoId;
      }
    }
  }
  
  return null;
};

export const isValidYouTubeUrl = (url: string): boolean => {
  return extractYouTubeVideoId(url) !== null;
};

export const getYouTubeThumbnail = (url: string): string => {
  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
};

export const fetchYouTubeVideoInfo = async (videoId: string): Promise<{
  title: string;
  duration: number; // in minutes
} | null> => {
  try {
    // Validate video ID format
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      throw new Error('Invalid video ID format');
    }

    // Using YouTube oEmbed API to get video title
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
    
    // For duration, we'll estimate based on typical video lengths
    // In a real implementation, you'd use YouTube Data API v3 with an API key
    // For now, we'll use a default of 10 minutes
    const estimatedDuration = 10;
    
    return {
      title: oEmbedData.title || 'Untitled Video',
      duration: estimatedDuration
    };
  } catch (error) {
    console.error('Error fetching YouTube video info:', error);
    throw error;
  }
};

export const generateCourseSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
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
