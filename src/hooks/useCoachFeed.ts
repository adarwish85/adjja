
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface CoachFeedPost {
  id: string;
  coach_id: string;
  post_type: string;
  title: string;
  content: string;
  target_classes: string[];
  target_students: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const useCoachFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CoachFeedPost[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coach_feed_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching coach feed:', error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Omit<CoachFeedPost, 'id' | 'coach_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('coach_feed_posts')
        .insert({
          coach_id: user.id,
          ...postData
        });

      if (error) throw error;
      
      toast.success("Post created successfully");
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    }
  };

  const updatePost = async (id: string, updates: Partial<CoachFeedPost>) => {
    try {
      const { error } = await supabase
        .from('coach_feed_posts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Post updated successfully");
      await fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error("Failed to update post");
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coach_feed_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Post deleted successfully");
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user?.id]);

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts
  };
};
