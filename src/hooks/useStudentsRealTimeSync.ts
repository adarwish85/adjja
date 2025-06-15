
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseStudentsRealTimeSyncProps {
  onStudentAdded?: () => void;
  onStudentUpdated?: () => void;
  onStudentRemoved?: () => void;
  onStudentRoleChanged?: () => void;
}

export const useStudentsRealTimeSync = ({
  onStudentAdded,
  onStudentUpdated,
  onStudentRemoved,
  onStudentRoleChanged,
}: UseStudentsRealTimeSyncProps) => {
  useEffect(() => {
    // Listen to students table changes
    const studentsChannel = supabase
      .channel('students-table-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Student added:', payload);
          onStudentAdded?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Student updated:', payload);
          onStudentUpdated?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Student removed:', payload);
          onStudentRemoved?.();
        }
      )
      .subscribe();

    // Listen to profiles table changes for role updates
    const profilesChannel = supabase
      .channel('profiles-student-role-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile role changed:', payload);
          // Trigger refresh when role changes occur
          if (payload.new.role_id !== payload.old.role_id) {
            onStudentRoleChanged?.();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(studentsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, [onStudentAdded, onStudentUpdated, onStudentRemoved, onStudentRoleChanged]);
};
