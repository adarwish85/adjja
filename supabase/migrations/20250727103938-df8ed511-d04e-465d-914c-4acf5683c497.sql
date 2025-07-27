-- Fix the last remaining function search_path issues
CREATE OR REPLACE FUNCTION public.approve_user_profile(p_user_id uuid, p_approved_by uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  current_user_role TEXT;
  user_role_name TEXT;
BEGIN
  -- Check if current user is Super Admin
  SELECT public.get_current_user_role() INTO current_user_role;

  IF current_user_role != 'Super Admin' THEN
    RAISE EXCEPTION 'Only Super Admin can approve user profiles';
  END IF;

  -- Update profile approval status
  UPDATE public.profiles 
  SET 
    approval_status = 'approved',
    approved_by = p_approved_by,
    approved_at = now(),
    mandatory_fields_completed = true,
    profile_completed = true,
    updated_at = now()
  WHERE id = p_user_id;

  -- Get user role to determine if student record should be created
  SELECT ur.name INTO user_role_name
  FROM public.profiles p
  JOIN public.user_roles ur ON p.role_id = ur.id
  WHERE p.id = p_user_id;

  -- Create student record if user is a Student
  IF user_role_name = 'Student' THEN
    PERFORM public.create_student_after_approval(p_user_id);
  END IF;

  -- Create notification for the user
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    p_user_id,
    'Profile Approved',
    'Congratulations! Your profile has been approved and you now have full access to the platform.',
    'approval'
  );

  RETURN FOUND;
END;
$function$;

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