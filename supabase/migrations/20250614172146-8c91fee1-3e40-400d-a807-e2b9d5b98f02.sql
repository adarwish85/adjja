
-- Extend attendance_records table with additional fields for smart attendance
ALTER TABLE public.attendance_records 
ADD COLUMN IF NOT EXISTS checked_in_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'self')),
ADD COLUMN IF NOT EXISTS counted_against_quota BOOLEAN DEFAULT true;

-- Create composite unique constraint to prevent duplicate check-ins (drop first if exists)
ALTER TABLE public.attendance_records 
DROP CONSTRAINT IF EXISTS unique_student_class_date;

ALTER TABLE public.attendance_records 
ADD CONSTRAINT unique_student_class_date 
UNIQUE (student_id, class_id, attendance_date);

-- Create function to validate and process attendance check-in
CREATE OR REPLACE FUNCTION public.process_attendance_checkin(
  p_student_id UUID,
  p_class_id UUID,
  p_checked_in_by UUID,
  p_source TEXT DEFAULT 'manual'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  current_date DATE := CURRENT_DATE;
  existing_checkin UUID;
  student_plan_id UUID;
  remaining_classes INTEGER;
  plan_period TEXT;
  plan_class_count INTEGER;
BEGIN
  -- Check if student is already checked in for this class today
  SELECT id INTO existing_checkin
  FROM public.attendance_records
  WHERE student_id = p_student_id 
    AND class_id = p_class_id 
    AND attendance_date = current_date;
  
  IF existing_checkin IS NOT NULL THEN
    result := json_build_object(
      'success', false,
      'error', 'Student already checked in to this class today',
      'checkin_id', existing_checkin
    );
    RETURN result;
  END IF;
  
  -- Get student's subscription plan details
  SELECT 
    s.subscription_plan_id,
    sp.number_of_classes,
    sp.subscription_period
  INTO student_plan_id, plan_class_count, plan_period
  FROM public.students s
  LEFT JOIN public.subscription_plans sp ON s.subscription_plan_id = sp.id
  WHERE s.id = p_student_id;
  
  -- Calculate remaining classes (simplified - would need more complex logic for real quota tracking)
  IF student_plan_id IS NOT NULL AND plan_class_count > 0 THEN
    -- Count recent check-ins based on plan period
    SELECT 
      GREATEST(0, plan_class_count - COUNT(*)) INTO remaining_classes
    FROM public.attendance_records ar
    WHERE ar.student_id = p_student_id
      AND ar.counted_against_quota = true
      AND ar.attendance_date >= 
        CASE plan_period
          WHEN 'weekly' THEN current_date - INTERVAL '7 days'
          WHEN 'monthly' THEN current_date - INTERVAL '30 days'  
          WHEN 'quarterly' THEN current_date - INTERVAL '90 days'
          WHEN 'yearly' THEN current_date - INTERVAL '365 days'
          ELSE current_date - INTERVAL '30 days'
        END;
  ELSE
    -- Unlimited or no plan
    remaining_classes := 999;
  END IF;
  
  -- Check if student has remaining classes
  IF remaining_classes <= 0 THEN
    result := json_build_object(
      'success', false,
      'error', 'No remaining classes in subscription quota',
      'remaining_classes', remaining_classes
    );
    RETURN result;
  END IF;
  
  -- Create the check-in record
  INSERT INTO public.attendance_records (
    student_id,
    class_id,
    attendance_date,
    status,
    checked_in_by,
    source,
    counted_against_quota
  ) VALUES (
    p_student_id,
    p_class_id,
    current_date,
    'present',
    p_checked_in_by,
    p_source,
    true
  ) RETURNING id INTO existing_checkin;
  
  result := json_build_object(
    'success', true,
    'checkin_id', existing_checkin,
    'remaining_classes', remaining_classes - 1,
    'message', 'Successfully checked in'
  );
  
  RETURN result;
END;
$$;

-- Create function to get available classes for student check-in
CREATE OR REPLACE FUNCTION public.get_available_classes_for_student(p_student_id UUID)
RETURNS TABLE (
  class_id UUID,
  class_name TEXT,
  instructor TEXT,
  schedule TEXT,
  already_checked_in BOOLEAN,
  is_enrolled BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as class_id,
    c.name as class_name,
    c.instructor,
    c.schedule,
    (ar.id IS NOT NULL) as already_checked_in,
    (ce.id IS NOT NULL) as is_enrolled
  FROM public.classes c
  LEFT JOIN public.class_enrollments ce ON c.id = ce.class_id 
    AND ce.student_id = p_student_id 
    AND ce.status = 'active'
  LEFT JOIN public.attendance_records ar ON c.id = ar.class_id 
    AND ar.student_id = p_student_id 
    AND ar.attendance_date = CURRENT_DATE
  WHERE c.status = 'Active'
  ORDER BY c.name;
END;
$$;
