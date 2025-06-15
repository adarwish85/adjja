
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface ProgressVideo {
  id: string;
  coach_id: string;
  student_id: string;
  class_id?: string;
  video_url: string;
  description?: string;
  duration_seconds: number;
  upload_date: string;
  created_at: string;
  updated_at: string;
}

export const useProgressVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<ProgressVideo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async (studentId?: string) => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('progress_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching progress videos:', error);
      toast.error("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async (videoData: Omit<ProgressVideo, 'id' | 'coach_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('progress_videos')
        .insert({
          coach_id: user.id,
          ...videoData
        });

      if (error) throw error;
      
      toast.success("Video uploaded successfully");
      await fetchVideos();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error("Failed to upload video");
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('progress_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Video deleted successfully");
      await fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error("Failed to delete video");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [user?.id]);

  return {
    videos,
    loading,
    uploadVideo,
    deleteVideo,
    fetchVideos
  };
};
