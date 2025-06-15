
-- Phase 1: Database Consistency Check & Fix

-- First, let's add the auth_user_id column to students table if it doesn't exist
-- (This might already exist based on the schema, but let's ensure it's properly set up)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'students' AND column_name = 'auth_user_id') THEN
        ALTER TABLE public.students ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Create a function to sync missing auth_user_id values by matching emails
CREATE OR REPLACE FUNCTION public.sync_student_auth_links()
RETURNS TABLE(
  student_id UUID,
  student_email TEXT,
  auth_user_id UUID,
  action TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Update students table with auth_user_id where missing
  RETURN QUERY
  WITH updated_students AS (
    UPDATE public.students s
    SET auth_user_id = p.id,
        updated_at = now()
    FROM public.profiles p
    WHERE s.email = p.email 
      AND s.auth_user_id IS NULL
      AND p.id IS NOT NULL
    RETURNING s.id, s.email, p.id as profile_id, 'linked'::text as action
  )
  SELECT 
    us.id,
    us.email,
    us.profile_id,
    us.action
  FROM updated_students us;
END;
$function$;

-- Create a function to validate auth links for all students
CREATE OR REPLACE FUNCTION public.validate_student_auth_links()
RETURNS TABLE(
  student_id UUID,
  student_name TEXT,
  student_email TEXT,
  has_auth_account BOOLEAN,
  auth_user_id UUID,
  issue_description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create an improved upgrade function that handles missing auth links
CREATE OR REPLACE FUNCTION public.upgrade_student_to_coach_with_autofix(p_student_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  coach_role_id UUID;
  current_user_role TEXT;
  student_auth_id UUID;
  student_email TEXT;
  student_name TEXT;
  profile_id UUID;
  result JSON;
BEGIN
  -- Check if current user is Super Admin
  SELECT public.get_current_user_role() INTO current_user_role;

  IF current_user_role != 'Super Admin' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Only Super Admin can upgrade users to Coach'
    );
  END IF;

  -- Get student details
  SELECT auth_user_id, email, name INTO student_auth_id, student_email, student_name
  FROM public.students 
  WHERE id = p_student_id;

  IF student_email IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Student not found'
    );
  END IF;

  -- If auth_user_id is missing, try to find and link it
  IF student_auth_id IS NULL THEN
    SELECT id INTO profile_id 
    FROM public.profiles 
    WHERE email = student_email;
    
    IF profile_id IS NOT NULL THEN
      -- Link the auth account to the student
      UPDATE public.students 
      SET auth_user_id = profile_id, updated_at = now()
      WHERE id = p_student_id;
      
      student_auth_id := profile_id;
    ELSE
      RETURN json_build_object(
        'success', false,
        'error', 'No auth account exists for this student. Please create an account first.',
        'student_name', student_name,
        'student_email', student_email
      );
    END IF;
  END IF;

  -- Get the Coach role ID
  SELECT id INTO coach_role_id FROM public.user_roles WHERE name = 'Coach' LIMIT 1;

  IF coach_role_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Coach role does not exist in user_roles'
    );
  END IF;

  -- Update user role to Coach
  UPDATE public.profiles 
  SET role_id = coach_role_id, updated_at = now()
  WHERE id = student_auth_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Profile not found for auth user ID'
    );
  END IF;

  -- Create coach profile entry
  INSERT INTO public.coach_profiles (user_id)
  VALUES (student_auth_id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN json_build_object(
    'success', true,
    'message', 'Student successfully upgraded to Coach',
    'student_name', student_name,
    'auth_user_id', student_auth_id
  );
END;
$function$;

-- Add index for better performance on auth_user_id lookups
CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON public.students(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);
