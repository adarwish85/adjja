
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseCoachesRealTimeSyncProps {
  onCoachAdded?: () => void;
  onCoachUpdated?: () => void;
  onCoachRemoved?: () => void;
  onStudentUpgraded?: () => void;
}

export const useCoachesRealTimeSync = ({
  onCoachAdded,
  onCoachUpdated,
  onCoachRemoved,
  onStudentUpgraded,
}: UseCoachesRealTimeSyncProps) => {
  useEffect(() => {
    // Listen to coaches table changes
    const coachesChannel = supabase
      .channel('coaches-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'coaches'
        },
        (payload) => {
          console.log('Coach added:', payload);
          onCoachAdded?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'coaches'
        },
        (payload) => {
          console.log('Coach updated:', payload);
          onCoachUpdated?.();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'coaches'
        },
        (payload) => {
          console.log('Coach removed:', payload);
          onCoachRemoved?.();
        }
      )
      .subscribe();

    // Listen to profiles table changes (role upgrades)
    const profilesChannel = supabase
      .channel('profiles-role-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile role updated:', payload);
          // Check if this was a role change to Coach
          if (payload.new.role_id !== payload.old.role_id) {
            onStudentUpgraded?.();
          }
        }
      )
      .subscribe();

    // Listen to students table changes (auth_user_id linking)
    const studentsChannel = supabase
      .channel('students-auth-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Student auth updated:', payload);
          // Check if auth_user_id was added/changed
          if (payload.new.auth_user_id !== payload.old.auth_user_id) {
            onStudentUpgraded?.();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coachesChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(studentsChannel);
    };
  }, [onCoachAdded, onCoachUpdated, onCoachRemoved, onStudentUpgraded]);
};
