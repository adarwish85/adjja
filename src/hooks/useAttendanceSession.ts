
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface AttendanceSession {
  id: string;
  class_id: string;
  session_date: string;
  start_time: string;
  end_time?: string;
  instructor_id: string;
  status: 'active' | 'completed' | 'cancelled';
  class?: {
    name: string;
    location: string;
  };
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  status: 'present' | 'late' | 'absent' | 'early_departure';
  check_in_time?: string;
  check_out_time?: string;
  late_minutes: number;
  early_departure_minutes: number;
  notes?: string;
  sync_status: 'pending' | 'synced' | 'failed';
  student: {
    id: string;
    name: string;
    email: string;
    profile_picture_url?: string;
    belt: string;
    stripes: number;
  };
}

export const useAttendanceSession = () => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

  // Start a new attendance session
  const startSession = async (classId: string, sessionDate?: string) => {
    if (!user?.id) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('start_attendance_session', {
        p_class_id: classId,
        p_instructor_id: user.id,
        p_session_date: sessionDate || new Date().toISOString().split('T')[0]
      });

      if (error) throw error;

      // Fetch the created session with class details
      const { data: sessionData, error: sessionError } = await supabase
        .from('attendance_sessions')
        .select(`
          *,
          classes!inner(name, location)
        `)
        .eq('id', data)
        .single();

      if (sessionError) throw sessionError;

      setCurrentSession({
        id: sessionData.id,
        class_id: sessionData.class_id,
        session_date: sessionData.session_date,
        start_time: sessionData.start_time,
        end_time: sessionData.end_time,
        instructor_id: sessionData.instructor_id,
        status: sessionData.status,
        class: {
          name: sessionData.classes.name,
          location: sessionData.classes.location
        }
      });

      // Load attendance records
      await loadAttendanceRecords(data);
      
      toast.success("Session started successfully");
      return data;
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error("Failed to start session");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load attendance records for a session
  const loadAttendanceRecords = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('attendance_tracking')
        .select(`
          *,
          students!inner(
            id, name, email, belt, stripes,
            profiles!inner(profile_picture_url)
          )
        `)
        .eq('session_id', sessionId)
        .order('students(name)');

      if (error) throw error;

      const records: AttendanceRecord[] = data.map(record => ({
        id: record.id,
        session_id: record.session_id,
        student_id: record.student_id,
        status: record.status,
        check_in_time: record.check_in_time,
        check_out_time: record.check_out_time,
        late_minutes: record.late_minutes || 0,
        early_departure_minutes: record.early_departure_minutes || 0,
        notes: record.notes,
        sync_status: record.sync_status || 'synced',
        student: {
          id: record.students.id,
          name: record.students.name,
          email: record.students.email,
          profile_picture_url: record.students.profiles?.profile_picture_url,
          belt: record.students.belt,
          stripes: record.students.stripes
        }
      }));

      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error loading attendance records:', error);
      toast.error("Failed to load attendance records");
    }
  };

  // Mark attendance with offline support
  const markAttendance = async (studentId: string, status: 'present' | 'late' | 'absent' | 'early_departure') => {
    if (!currentSession || !user?.id) return;

    const attendanceData = {
      session_id: currentSession.id,
      student_id: studentId,
      status: status,
      marked_by: user.id,
      timestamp: new Date().toISOString()
    };

    // Update local state immediately for responsive UI
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.student_id === studentId 
          ? { ...record, status, sync_status: 'pending' as const }
          : record
      )
    );

    try {
      // Try to sync immediately
      const { data, error } = await supabase.rpc('mark_attendance', {
        p_session_id: currentSession.id,
        p_student_id: studentId,
        p_status: status,
        p_marked_by: user.id,
        p_sync_status: 'synced'
      });

      if (error) throw error;

      // Update sync status to synced
      setAttendanceRecords(prev => 
        prev.map(record => 
          record.student_id === studentId 
            ? { ...record, sync_status: 'synced' as const }
            : record
        )
      );

      // Provide haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

    } catch (error) {
      console.error('Error marking attendance:', error);
      
      // Add to offline queue
      setOfflineQueue(prev => [...prev, attendanceData]);
      
      // Update sync status to failed
      setAttendanceRecords(prev => 
        prev.map(record => 
          record.student_id === studentId 
            ? { ...record, sync_status: 'failed' as const }
            : record
        )
      );

      toast.error("Saved offline - will sync when connection is restored");
    }
  };

  // Sync offline queue when connection is restored
  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;

    const itemsToSync = [...offlineQueue];
    setOfflineQueue([]);

    for (const item of itemsToSync) {
      try {
        await supabase.rpc('mark_attendance', {
          p_session_id: item.session_id,
          p_student_id: item.student_id,
          p_status: item.status,
          p_marked_by: item.marked_by,
          p_sync_status: 'synced'
        });

        // Update sync status
        setAttendanceRecords(prev => 
          prev.map(record => 
            record.student_id === item.student_id 
              ? { ...record, sync_status: 'synced' as const }
              : record
          )
        );
      } catch (error) {
        console.error('Error syncing offline item:', error);
        // Add back to queue if still failing
        setOfflineQueue(prev => [...prev, item]);
      }
    }

    if (offlineQueue.length === 0) {
      toast.success("All attendance records synced successfully");
    }
  };

  // Monitor online status and sync when back online
  useEffect(() => {
    const handleOnline = () => {
      if (offlineQueue.length > 0) {
        syncOfflineQueue();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [offlineQueue]);

  // End session
  const endSession = async () => {
    if (!currentSession) return;

    try {
      const { error } = await supabase
        .from('attendance_sessions')
        .update({ 
          status: 'completed',
          end_time: new Date().toTimeString().split(' ')[0]
        })
        .eq('id', currentSession.id);

      if (error) throw error;

      setCurrentSession(null);
      setAttendanceRecords([]);
      toast.success("Session ended successfully");
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error("Failed to end session");
    }
  };

  return {
    currentSession,
    attendanceRecords,
    loading,
    offlineQueue: offlineQueue.length,
    startSession,
    loadAttendanceRecords,
    markAttendance,
    endSession,
    syncOfflineQueue
  };
};
