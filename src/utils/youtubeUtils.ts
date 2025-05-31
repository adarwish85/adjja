
// Utility functions for YouTube video integration
export const extractYouTubeVideoId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
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
    // Using YouTube oEmbed API to get video title
    const oEmbedResponse = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    
    if (!oEmbedResponse.ok) {
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
    return null;
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
