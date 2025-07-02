
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseCoachRealTimeSyncProps {
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
}: UseCoachRealTimeSyncProps) => {
  useEffect(() => {
    console.log("useCoachesRealTimeSync: Setting up real-time subscriptions");

    // Listen to traditional coaches table changes
    const coachesChannel = supabase
      .channel('coaches-table-changes')
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

    // Listen to students table changes (for upgraded coaches)
    const studentsChannel = supabase
      .channel('students-coach-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students'
        },
        (payload) => {
          console.log('Real-time: Student data changed (affects coach counts):', payload);
          onStudentUpgraded?.();
        }
      )
      .subscribe();

    // Listen to profiles table changes (for role upgrades)
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
          console.log('Real-time: Profile role changed:', payload);
          // Check if role_id changed (indicating role upgrade/downgrade)
          if (payload.new.role_id !== payload.old.role_id) {
            onStudentUpgraded?.();
          }
        }
      )
      .subscribe();

    // Listen to class enrollments changes
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
          console.log('Real-time: Class enrollment changed (affects coach counts):', payload);
          onCoachUpdated?.();
        }
      )
      .subscribe();

    // Listen to classes table changes
    const classesChannel = supabase
      .channel('classes-instructor-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classes'
        },
        (payload) => {
          console.log('Real-time: Class instructor changed (affects coach counts):', payload);
          onCoachUpdated?.();
        }
      )
      .subscribe();

    return () => {
      console.log("useCoachesRealTimeSync: Cleaning up real-time subscriptions");
      supabase.removeChannel(coachesChannel);
      supabase.removeChannel(studentsChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(enrollmentsChannel);
      supabase.removeChannel(classesChannel);
    };
  }, [onCoachAdded, onCoachUpdated, onCoachRemoved, onStudentUpgraded]);
};
