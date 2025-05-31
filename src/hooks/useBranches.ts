
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Branch = Tables<"branches">;
type BranchInsert = TablesInsert<"branches">;
type BranchUpdate = TablesUpdate<"branches">;

export const useBranches = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all branches
  const {
    data: branches = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      console.log("Fetching branches...");
      const { data, error } = await supabase
        .from("branches")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching branches:", error);
        throw error;
      }
      console.log("Fetched branches:", data);
      return data as Branch[];
    },
  });

  // Create branch mutation
  const createBranch = useMutation({
    mutationFn: async (branchData: BranchInsert) => {
      console.log("Creating branch:", branchData);
      const { data, error } = await supabase
        .from("branches")
        .insert([branchData])
        .select()
        .single();

      if (error) {
        console.error("Error creating branch:", error);
        throw error;
      }
      console.log("Created branch:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast({
        title: "Success",
        description: "Branch created successfully",
      });
    },
    onError: (error) => {
      console.error("Create branch error:", error);
      toast({
        title: "Error",
        description: "Failed to create branch",
        variant: "destructive",
      });
    },
  });

  // Update branch mutation
  const updateBranch = useMutation({
    mutationFn: async ({ id, ...updateData }: BranchUpdate & { id: string }) => {
      console.log("Updating branch:", id, updateData);
      const { data, error } = await supabase
        .from("branches")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating branch:", error);
        throw error;
      }
      console.log("Updated branch:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast({
        title: "Success",
        description: "Branch updated successfully",
      });
    },
    onError: (error) => {
      console.error("Update branch error:", error);
      toast({
        title: "Error",
        description: "Failed to update branch",
        variant: "destructive",
      });
    },
  });

  // Delete branch mutation
  const deleteBranch = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting branch:", id);
      const { error } = await supabase
        .from("branches")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting branch:", error);
        throw error;
      }
      console.log("Deleted branch:", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast({
        title: "Success",
        description: "Branch deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete branch error:", error);
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    },
  });

  return {
    branches,
    isLoading,
    error,
    createBranch,
    updateBranch,
    deleteBranch,
  };
};
