-- Continue fixing remaining database functions with proper search_path

CREATE OR REPLACE FUNCTION public.downgrade_coach_to_student(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  student_role_id UUID;
  current_user_role TEXT;
BEGIN
  -- Check if current user is Super Admin
  SELECT ur.name INTO current_user_role
  FROM public.profiles p
  JOIN public.user_roles ur ON p.role_id = ur.id
  WHERE p.id = auth.uid();

  IF current_user_role != 'Super Admin' THEN
    RAISE EXCEPTION 'Only Super Admin can downgrade users to Student';
  END IF;

  -- Get the Student role ID
  SELECT id INTO student_role_id FROM public.user_roles WHERE name = 'Student' LIMIT 1;

  -- Update user role to Student
  UPDATE public.profiles 
  SET role_id = student_role_id, updated_at = now()
  WHERE id = p_user_id;

  -- Remove coach profile (optionally, you may soft-delete or handle this as needed)
  DELETE FROM public.coach_profiles WHERE user_id = p_user_id;

  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_setting_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.value IS DISTINCT FROM NEW.value THEN
    INSERT INTO public.system_settings_history (
      setting_id,
      old_value,
      new_value,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      OLD.value,
      NEW.value,
      NEW.updated_by,
      'Setting updated'
    );
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_setting(p_category text, p_key text, p_value jsonb, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  setting_id UUID;
  current_user_id UUID := auth.uid();
BEGIN
  -- Insert or update setting
  INSERT INTO public.system_settings (
    category,
    key,
    value,
    branch_id,
    created_by,
    updated_by
  ) VALUES (
    p_category,
    p_key,
    p_value,
    p_branch_id,
    current_user_id,
    current_user_id
  )
  ON CONFLICT (category, key, COALESCE(branch_id, '00000000-0000-0000-0000-000000000000'::uuid))
  DO UPDATE SET
    value = EXCLUDED.value,
    updated_by = EXCLUDED.updated_by,
    updated_at = now()
  RETURNING id INTO setting_id;
  
  RETURN setting_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_course_enrollment_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Update the total_students count for the affected course
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.courses 
    SET total_students = (
      SELECT COUNT(*) 
      FROM public.course_enrollments 
      WHERE course_id = NEW.course_id AND status = 'Active'
    ),
    updated_at = now()
    WHERE id = NEW.course_id;
  END IF;
  
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.course_id != NEW.course_id) THEN
    UPDATE public.courses 
    SET total_students = (
      SELECT COUNT(*) 
      FROM public.course_enrollments 
      WHERE course_id = OLD.course_id AND status = 'Active'
    ),
    updated_at = now()
    WHERE id = OLD.course_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.reject_user_profile(p_user_id uuid, p_rejected_by uuid, p_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  current_user_role TEXT;
BEGIN
  -- Check if current user is Super Admin
  SELECT public.get_current_user_role() INTO current_user_role;

  IF current_user_role != 'Super Admin' THEN
    RAISE EXCEPTION 'Only Super Admin can reject user profiles';
  END IF;

  -- Update profile approval status
  UPDATE public.profiles 
  SET 
    approval_status = 'rejected',
    approved_by = p_rejected_by,
    approved_at = now(),
    rejection_reason = p_reason,
    updated_at = now()
  WHERE id = p_user_id;

  -- Create notification for the user
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    p_user_id,
    'Profile Requires Updates',
    CONCAT('Your profile needs some updates before approval. Reason: ', p_reason),
    'warning'
  );

  RETURN FOUND;
END;
$function$;

CREATE OR REPLACE FUNCTION public.start_attendance_session(p_class_id uuid, p_instructor_id uuid, p_session_date date DEFAULT CURRENT_DATE)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;