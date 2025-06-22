
-- Phase 1: Database & RLS Cleanup (Fixed version)

-- Disable RLS temporarily to clean up
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies with CASCADE to ensure clean removal
DO $$ 
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', policy_record.policyname);
    END LOOP;
END $$;

-- Create a secure definer function to get current user role (prevents recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.name
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  LEFT JOIN public.user_roles ur ON p.role_id = ur.id
  WHERE au.id = auth.uid();
$$;

-- Re-enable RLS and create new policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive RLS policies for profiles
CREATE POLICY "users_can_view_own_profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Super Admins can view all profiles (using security definer function)
CREATE POLICY "super_admins_can_view_all_profiles"
ON public.profiles FOR SELECT
USING (public.get_current_user_role() = 'Super Admin');

-- Super Admins can update all profiles (for approval workflow)
CREATE POLICY "super_admins_can_update_all_profiles"
ON public.profiles FOR UPDATE
USING (public.get_current_user_role() = 'Super Admin');

-- Update the handle_new_user function to ensure proper role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  
  -- Insert into profiles table with Student role
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
  
  RETURN new;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create default roles if they don't exist
INSERT INTO public.user_roles (name, description, is_system, permissions) VALUES
  ('Student', 'Default student role with basic access', true, ARRAY['view_own_profile', 'edit_own_profile']),
  ('Coach', 'Coach role with student management access', true, ARRAY['view_own_profile', 'edit_own_profile', 'manage_students', 'view_attendance']),
  ('Super Admin', 'Administrator with full system access', true, ARRAY['*'])
ON CONFLICT (name) DO NOTHING;
