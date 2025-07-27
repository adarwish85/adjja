-- Fix remaining critical security issues

-- Fix 1: Enable RLS on coaches table that was missed
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

-- Fix 2: Add search_path to remaining functions
CREATE OR REPLACE FUNCTION public.calculate_attendance_streak(p_student_id uuid)
RETURNS TABLE(current_streak integer, longest_streak integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.create_student_account(p_email text, p_password text, p_username text, p_name text, p_phone text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  new_user_id uuid;
  student_role_id uuid;
BEGIN
  -- Get the Student role ID
  SELECT id INTO student_role_id FROM public.user_roles WHERE name = 'Student' LIMIT 1;
  
  -- Create the auth user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    jsonb_build_object('name', p_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ) RETURNING id INTO new_user_id;
  
  -- Update the profile with additional data
  INSERT INTO public.profiles (id, name, email, phone, username, role_id, status)
  VALUES (new_user_id, p_name, p_email, p_phone, p_username, student_role_id, 'active')
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    username = EXCLUDED.username,
    role_id = EXCLUDED.role_id,
    status = EXCLUDED.status;
  
  RETURN new_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_student_after_approval(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  user_profile RECORD;
  student_role_id UUID;
BEGIN
  -- Get user profile information
  SELECT p.name, p.email, p.phone 
  INTO user_profile
  FROM public.profiles p
  WHERE p.id = p_user_id AND p.approval_status = 'approved';
  
  -- Only proceed if user is approved
  IF user_profile IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get Student role ID
  SELECT id INTO student_role_id FROM public.user_roles WHERE name = 'Student' LIMIT 1;
  
  -- Check if student record already exists
  IF NOT EXISTS (SELECT 1 FROM public.students WHERE auth_user_id = p_user_id) THEN
    -- Create student record
    INSERT INTO public.students (
      auth_user_id,
      name,
      email,
      phone,
      branch,
      belt,
      coach,
      status,
      membership_type,
      payment_status
    ) VALUES (
      p_user_id,
      user_profile.name,
      user_profile.email,
      user_profile.phone,
      'Main Branch', -- Default branch
      'White', -- Default belt
      'Unassigned', -- Default coach
      'active',
      'monthly',
      'unpaid'
    );
    
    -- Log the student creation
    INSERT INTO public.user_activity_logs (user_id, user_name, action, category, details, status)
    VALUES (
      p_user_id,
      user_profile.name,
      'Student Record Created',
      'Approval',
      'Student record created after profile approval',
      'success'
    );
  END IF;
  
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_setting_value(p_category text, p_key text, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  result JSONB;
BEGIN
  -- First try to get branch-specific setting
  IF p_branch_id IS NOT NULL THEN
    SELECT value INTO result
    FROM public.system_settings
    WHERE category = p_category
      AND key = p_key
      AND branch_id = p_branch_id;
  END IF;
  
  -- If no branch-specific setting found, get global setting
  IF result IS NULL THEN
    SELECT value INTO result
    FROM public.system_settings
    WHERE category = p_category
      AND key = p_key
      AND branch_id IS NULL;
  END IF;
  
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.mark_attendance(p_session_id uuid, p_student_id uuid, p_status text, p_marked_by uuid, p_sync_status text DEFAULT 'synced'::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.process_attendance_checkin(p_student_id uuid, p_class_id uuid, p_checked_in_by uuid, p_source text DEFAULT 'manual'::text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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

CREATE OR REPLACE FUNCTION public.sync_existing_user_approvals()
RETURNS TABLE(user_id uuid, user_name text, action_taken text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Find users who have student records but are still pending approval
  RETURN QUERY
  WITH pending_with_students AS (
    SELECT 
      p.id,
      p.name,
      'auto_approved_existing_student' as action
    FROM public.profiles p
    JOIN public.students s ON p.id = s.auth_user_id
    WHERE p.approval_status = 'pending'
      AND s.status = 'active'
  ),
  updated_profiles AS (
    UPDATE public.profiles
    SET 
      approval_status = 'approved',
      approved_at = now(),
      mandatory_fields_completed = true,
      profile_completed = true,
      updated_at = now()
    WHERE id IN (SELECT id FROM pending_with_students)
    RETURNING id, name, 'auto_approved_existing_student'::text as action
  )
  SELECT up.id, up.name, up.action FROM updated_profiles up;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_student_auth_links()
RETURNS TABLE(student_id uuid, student_name text, student_email text, has_auth_account boolean, auth_user_id uuid, issue_description text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.email,
    (p.id IS NOT NULL) as has_auth_account,
    s.auth_user_id,
    CASE 
      WHEN s.auth_user_id IS NULL AND p.id IS NOT NULL THEN 'Missing auth_user_id link'
      WHEN s.auth_user_id IS NOT NULL AND p.id IS NULL THEN 'Invalid auth_user_id reference'
      WHEN s.auth_user_id IS NULL AND p.id IS NULL THEN 'No auth account exists'
      ELSE 'OK'
    END as issue_description
  FROM public.students s
  LEFT JOIN public.profiles p ON s.email = p.email
  ORDER BY 
    CASE 
      WHEN s.auth_user_id IS NULL AND p.id IS NOT NULL THEN 1
      WHEN s.auth_user_id IS NOT NULL AND p.id IS NULL THEN 2
      WHEN s.auth_user_id IS NULL AND p.id IS NULL THEN 3
      ELSE 4
    END,
    s.name;
END;
$function$;