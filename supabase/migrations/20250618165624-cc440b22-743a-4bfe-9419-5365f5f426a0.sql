
-- Create attendance_sessions table to track class sessions
CREATE TABLE public.attendance_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id),
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIME NOT NULL DEFAULT CURRENT_TIME,
  end_time TIME,
  instructor_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create detailed attendance_tracking table
CREATE TABLE public.attendance_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.attendance_sessions(id),
  student_id UUID NOT NULL REFERENCES public.students(id),
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'absent' CHECK (status IN ('present', 'late', 'absent', 'early_departure')),
  late_minutes INTEGER DEFAULT 0,
  early_departure_minutes INTEGER DEFAULT 0,
  notes TEXT,
  marked_by UUID REFERENCES public.profiles(id),
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('pending', 'synced', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, student_id)
);

-- Create attendance_stats materialized view for performance
CREATE MATERIALIZED VIEW public.student_attendance_stats AS
SELECT 
  s.id as student_id,
  s.name,
  s.email,
  COUNT(at.id) as total_sessions,
  COUNT(CASE WHEN at.status IN ('present', 'late') THEN 1 END) as attended_sessions,
  COUNT(CASE WHEN at.status = 'late' THEN 1 END) as late_sessions,
  COUNT(CASE WHEN at.status = 'early_departure' THEN 1 END) as early_departure_sessions,
  ROUND(
    (COUNT(CASE WHEN at.status IN ('present', 'late') THEN 1 END) * 100.0) / 
    NULLIF(COUNT(at.id), 0), 2
  ) as attendance_percentage,
  MAX(CASE WHEN at.status IN ('present', 'late') THEN at.created_at END) as last_attended
FROM public.students s
LEFT JOIN public.attendance_tracking at ON s.id = at.student_id
LEFT JOIN public.attendance_sessions asess ON at.session_id = asess.id
WHERE asess.session_date >= CURRENT_DATE - INTERVAL '90 days' OR asess.session_date IS NULL
GROUP BY s.id, s.name, s.email;

-- Add indexes for performance
CREATE INDEX idx_attendance_sessions_class_date ON public.attendance_sessions(class_id, session_date);
CREATE INDEX idx_attendance_tracking_session ON public.attendance_tracking(session_id);
CREATE INDEX idx_attendance_tracking_student ON public.attendance_tracking(student_id);
CREATE INDEX idx_attendance_tracking_sync ON public.attendance_tracking(sync_status);

-- Enable RLS
ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for attendance sessions
CREATE POLICY "Coaches can manage attendance sessions" 
  ON public.attendance_sessions 
  FOR ALL 
  USING (true);

-- Create policies for attendance tracking
CREATE POLICY "Coaches can manage attendance tracking" 
  ON public.attendance_tracking 
  FOR ALL 
  USING (true);

-- Function to refresh attendance stats
CREATE OR REPLACE FUNCTION public.refresh_attendance_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.student_attendance_stats;
END;
$$;

-- Function to calculate attendance streaks
CREATE OR REPLACE FUNCTION public.calculate_attendance_streak(p_student_id uuid)
RETURNS TABLE(current_streak integer, longest_streak integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_streak_count INTEGER := 0;
  longest_streak_count INTEGER := 0;
  temp_streak INTEGER := 0;
  attendance_record RECORD;
BEGIN
  -- Calculate current streak (consecutive recent attendances)
  FOR attendance_record IN 
    SELECT at.status, asess.session_date
    FROM public.attendance_tracking at
    JOIN public.attendance_sessions asess ON at.session_id = asess.id
    WHERE at.student_id = p_student_id
    ORDER BY asess.session_date DESC
  LOOP
    IF attendance_record.status IN ('present', 'late') THEN
      current_streak_count := current_streak_count + 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  -- Calculate longest streak
  temp_streak := 0;
  longest_streak_count := 0;
  
  FOR attendance_record IN 
    SELECT at.status, asess.session_date
    FROM public.attendance_tracking at
    JOIN public.attendance_sessions asess ON at.session_id = asess.id
    WHERE at.student_id = p_student_id
    ORDER BY asess.session_date ASC
  LOOP
    IF attendance_record.status IN ('present', 'late') THEN
      temp_streak := temp_streak + 1;
      longest_streak_count := GREATEST(longest_streak_count, temp_streak);
    ELSE
      temp_streak := 0;
    END IF;
  END LOOP;

  RETURN QUERY SELECT current_streak_count, longest_streak_count;
END;
$$;

-- Function to start a new attendance session
CREATE OR REPLACE FUNCTION public.start_attendance_session(
  p_class_id uuid,
  p_instructor_id uuid,
  p_session_date date DEFAULT CURRENT_DATE
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id uuid;
  student_record RECORD;
BEGIN
  -- Create new session
  INSERT INTO public.attendance_sessions (class_id, session_date, instructor_id)
  VALUES (p_class_id, p_session_date, p_instructor_id)
  RETURNING id INTO session_id;
  
  -- Pre-populate with enrolled students
  FOR student_record IN 
    SELECT s.id as student_id
    FROM public.students s
    JOIN public.class_enrollments ce ON s.id = ce.student_id
    WHERE ce.class_id = p_class_id AND ce.status = 'active'
  LOOP
    INSERT INTO public.attendance_tracking (session_id, student_id, status)
    VALUES (session_id, student_record.student_id, 'absent');
  END LOOP;
  
  RETURN session_id;
END;
$$;

-- Function to mark attendance with offline sync support
CREATE OR REPLACE FUNCTION public.mark_attendance(
  p_session_id uuid,
  p_student_id uuid,
  p_status text,
  p_marked_by uuid,
  p_sync_status text DEFAULT 'synced'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result json;
  late_mins integer := 0;
  early_mins integer := 0;
  session_start time;
  current_time_val time := CURRENT_TIME;
BEGIN
  -- Get session start time for late calculation
  SELECT start_time INTO session_start
  FROM public.attendance_sessions
  WHERE id = p_session_id;
  
  -- Calculate late minutes if applicable
  IF p_status = 'late' AND session_start IS NOT NULL THEN
    late_mins := EXTRACT(EPOCH FROM (current_time_val - session_start)) / 60;
  END IF;
  
  -- Update or insert attendance record
  INSERT INTO public.attendance_tracking (
    session_id, student_id, status, marked_by, sync_status,
    check_in_time, late_minutes
  )
  VALUES (
    p_session_id, p_student_id, p_status, p_marked_by, p_sync_status,
    CASE WHEN p_status IN ('present', 'late') THEN now() ELSE NULL END,
    late_mins
  )
  ON CONFLICT (session_id, student_id)
  DO UPDATE SET
    status = EXCLUDED.status,
    marked_by = EXCLUDED.marked_by,
    sync_status = EXCLUDED.sync_status,
    check_in_time = CASE WHEN EXCLUDED.status IN ('present', 'late') THEN now() ELSE attendance_tracking.check_in_time END,
    late_minutes = EXCLUDED.late_minutes,
    updated_at = now();
  
  result := json_build_object(
    'success', true,
    'student_id', p_student_id,
    'status', p_status,
    'late_minutes', late_mins
  );
  
  RETURN result;
END;
$$;
