
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface CoachNote {
  id: string;
  coach_id: string;
  student_id: string;
  class_id?: string;
  note_content: string;
  session_date: string;
  created_at: string;
  updated_at: string;
}

export const useCoachNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coach_notes')
        .select('*')
        .eq('coach_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching coach notes:', error);
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (noteData: Omit<CoachNote, 'id' | 'coach_id' | 'created_at' | 'updated_at'>) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('coach_notes')
        .insert({
          coach_id: user.id,
          ...noteData
        });

      if (error) throw error;
      
      toast.success("Note added successfully");
      await fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error("Failed to add note");
    }
  };

  const updateNote = async (id: string, updates: Partial<CoachNote>) => {
    try {
      const { error } = await supabase
        .from('coach_notes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Note updated successfully");
      await fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error("Failed to update note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coach_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Note deleted successfully");
      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error("Failed to delete note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [user?.id]);

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes
  };
};
