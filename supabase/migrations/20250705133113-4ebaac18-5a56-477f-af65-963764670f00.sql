
-- Phase 1: Update handle_new_user function to prevent automatic student record creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  student_role_id UUID;
BEGIN
  -- Get the Student role ID
  SELECT id INTO student_role_id FROM public.user_roles WHERE name = 'Student' LIMIT 1;
  
  -- If Student role doesn't exist, create it
  IF student_role_id IS NULL THEN
    INSERT INTO public.user_roles (name, description, is_system)
    VALUES ('Student', 'Default student role', true)
    RETURNING id INTO student_role_id;
  END IF;
  
  -- Insert into profiles table with Student role and pending status
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    role_id, 
    status, 
    approval_status, 
    mandatory_fields_completed,
    profile_completed
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    student_role_id,
    'active',
    'pending',
    false,
    false
  );
  
  -- Log the registration activity
  INSERT INTO public.user_activity_logs (user_id, user_name, action, category, details, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'User Registration',
    'Authentication',
    'New user account created - pending profile approval',
    'success'
  );
  
  RETURN new;
END;
$$;

-- Phase 2: Create function to handle profile approval and student record creation
CREATE OR REPLACE FUNCTION public.create_student_after_approval(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Phase 3: Update the approve_user_profile function to create student record
CREATE OR REPLACE FUNCTION public.approve_user_profile(p_user_id uuid, p_approved_by uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Phase 4: Create function to sync existing users and clean up inconsistencies
CREATE OR REPLACE FUNCTION public.sync_existing_user_approvals()
RETURNS TABLE(user_id uuid, user_name text, action_taken text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Phase 5: Add RLS policy to ensure students table respects approval status
CREATE POLICY "Only approved users can have student records" 
ON public.students 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = students.auth_user_id 
    AND p.approval_status = 'approved'
  )
);

-- Enable RLS on students table if not already enabled
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
