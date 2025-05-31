
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type ContentLibraryItem = Tables<"content_library">;
type ContentLibraryInsert = TablesInsert<"content_library">;
type ContentLibraryUpdate = TablesUpdate<"content_library">;

export const useContentLibrary = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: contentItems = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["content_library"],
    queryFn: async () => {
      console.log("Fetching content library...");
      const { data, error } = await supabase
        .from("content_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching content library:", error);
        throw error;
      }
      console.log("Fetched content library:", data);
      return data as ContentLibraryItem[];
    },
  });

  const createContentItem = useMutation({
    mutationFn: async (itemData: ContentLibraryInsert) => {
      console.log("Creating content item:", itemData);
      const { data, error } = await supabase
        .from("content_library")
        .insert([itemData])
        .select()
        .single();

      if (error) {
        console.error("Error creating content item:", error);
        throw error;
      }
      console.log("Created content item:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content_library"] });
      toast({
        title: "Success",
        description: "Content uploaded successfully",
      });
    },
    onError: (error) => {
      console.error("Create content item error:", error);
      toast({
        title: "Error",
        description: "Failed to upload content",
        variant: "destructive",
      });
    },
  });

  const updateContentItem = useMutation({
    mutationFn: async ({ id, ...updateData }: ContentLibraryUpdate & { id: string }) => {
      console.log("Updating content item:", id, updateData);
      const { data, error } = await supabase
        .from("content_library")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating content item:", error);
        throw error;
      }
      console.log("Updated content item:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content_library"] });
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    },
    onError: (error) => {
      console.error("Update content item error:", error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    },
  });

  const deleteContentItem = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting content item:", id);
      const { error } = await supabase
        .from("content_library")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting content item:", error);
        throw error;
      }
      console.log("Deleted content item:", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content_library"] });
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete content item error:", error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    },
  });

  return {
    contentItems,
    isLoading,
    error,
    createContentItem,
    updateContentItem,
    deleteContentItem,
  };
};
