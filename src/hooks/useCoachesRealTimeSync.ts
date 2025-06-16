
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    console.log("Setting up enhanced real-time sync for coaches...");

    // Listen to coaches table changes (traditional coaches)
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
          console.log('Real-time: Traditional coach added:', payload);
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
          console.log('Real-time: Traditional coach updated:', payload);
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
          console.log('Real-time: Traditional coach removed:', payload);
          onCoachRemoved?.();
        }
      )
      .subscribe();

    // Listen to profiles table changes (role upgrades to coach)
    const profilesChannel = supabase
      .channel('profiles-coach-role-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Real-time: Profile role updated:', payload);
          // Check if this was a role change involving Coach role
          if (payload.new.role_id !== payload.old.role_id) {
            console.log('Real-time: Role change detected, refreshing coaches...');
            onStudentUpgraded?.();
          }
        }
      )
      .subscribe();

    // CRITICAL: Listen to students table changes for coach field updates
    const studentsChannel = supabase
      .channel('students-coach-field-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Real-time: Student updated:', payload);
          // Check if coach field was changed
          if (payload.new.coach !== payload.old.coach) {
            console.log('Real-time: Student coach field changed, refreshing coaches...');
            onStudentUpgraded?.();
          }
          // Check if auth_user_id was added/changed (student got account)
          if (payload.new.auth_user_id !== payload.old.auth_user_id) {
            console.log('Real-time: Student auth linking changed, checking for coach role...');
            onStudentUpgraded?.();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Real-time: New student added:', payload);
          // New students might potentially become coaches or be assigned to coaches
          if (payload.new.auth_user_id || payload.new.coach === "Coach") {
            onStudentUpgraded?.();
          }
        }
      )
      .subscribe();

    // NEW: Listen to class enrollment changes that affect coach student counts
    const enrollmentsChannel = supabase
      .channel('class-enrollments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_enrollments'
        },
        (payload) => {
          console.log('Real-time: Class enrollment changed:', payload);
          // Any enrollment change can affect coach student counts
          onStudentUpgraded?.();
        }
      )
      .subscribe();

    // NEW: Listen to class changes that might affect coach assignments
    const classesChannel = supabase
      .channel('classes-instructor-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'classes'
        },
        (payload) => {
          console.log('Real-time: Class updated:', payload);
          // Check if instructor was changed
          if (payload.new.instructor !== payload.old.instructor) {
            console.log('Real-time: Class instructor changed, refreshing coaches...');
            onStudentUpgraded?.();
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'classes'
        },
        (payload) => {
          console.log('Real-time: New class added:', payload);
          // New classes with instructors might affect coach counts
          onStudentUpgraded?.();
        }
      )
      .subscribe();

    // Listen to user_roles table changes (direct role assignments)
    const userRolesChannel = supabase
      .channel('user-roles-coach-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles'
        },
        (payload) => {
          console.log('Real-time: User roles changed:', payload);
          // Any change in user roles could affect coach listings
          onStudentUpgraded?.();
        }
      )
      .subscribe();

    console.log("Enhanced real-time sync channels established");

    return () => {
      console.log("Cleaning up enhanced real-time sync channels");
      supabase.removeChannel(coachesChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(studentsChannel);
      supabase.removeChannel(enrollmentsChannel);
      supabase.removeChannel(classesChannel);
      supabase.removeChannel(userRolesChannel);
    };
  }, [onCoachAdded, onCoachUpdated, onCoachRemoved, onStudentUpgraded]);
};
