
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Note } from "@/types/note";

export const useNotes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // This is a mock implementation since we don't have a notes table yet
  // In a real implementation, you'd need to create a notes table in Supabase
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['student-notes', user?.id],
    queryFn: async () => {
      // Mock data for now
      const mockNotes: Note[] = [
        {
          id: '1',
          title: 'Triangle Choke Setup',
          content: 'Key points for triangle choke from guard:\n- Control the wrist\n- Create the angle\n- Pull down on the head\n- Adjust your hips',
          tags: ['guard', 'submissions', 'triangle'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Sweeps from Half Guard',
          content: 'Half guard sweep techniques:\n- Underhook sweep\n- Plan B sweep\n- Old school sweep',
          tags: ['half-guard', 'sweeps', 'bottom-game'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      return mockNotes;
    },
    enabled: !!user
  });

  // Create delete mutation that properly invalidates the cache
  const deleteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      // Mock delete operation - in real app, this would be a Supabase delete
      return { success: true, deletedId: noteId };
    },
    onSuccess: () => {
      toast.success("Note deleted!");
      // Invalidate and refetch the notes query to update the UI immediately
      queryClient.invalidateQueries({ queryKey: ['student-notes'] });
    },
    onError: () => {
      toast.error("Failed to delete note");
    }
  });

  // Create save mutation that properly invalidates the cache
  const saveMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string; tags: string; id?: string }) => {
      // Mock save operation - in real app, this would be a Supabase insert/update
      return { success: true, ...noteData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notes'] });
    },
    onError: () => {
      toast.error("Failed to save note");
    }
  });

  return {
    notes,
    isLoading,
    deleteMutation,
    saveMutation
  };
};
