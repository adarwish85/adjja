
-- Add approval status and completion tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS profile_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Add mandatory fields tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS mandatory_fields_completed boolean DEFAULT false;

-- Create profile completion audit table
CREATE TABLE IF NOT EXISTS public.profile_completion_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  step_completed text NOT NULL,
  completed_at timestamp with time zone DEFAULT now(),
  field_data jsonb
);

-- Enable RLS on the audit table
ALTER TABLE public.profile_completion_audit ENABLE ROW LEVEL SECURITY;

-- Create policies for profile completion audit
CREATE POLICY "Users can view their own completion audit"
  ON public.profile_completion_audit
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completion audit"
  ON public.profile_completion_audit
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update the handle_new_user function to set pending status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  student_role_id UUID;
BEGIN
  -- Get the Student role ID
  SELECT id INTO student_role_id FROM public.user_roles WHERE name = 'Student' LIMIT 1;
  
  -- Insert into profiles table with Student role and pending approval
  INSERT INTO public.profiles (id, name, email, role_id, status, approval_status, profile_completed)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    student_role_id,
    'active',
    'pending',
    false
  );
  
  -- Log the registration activity
  INSERT INTO public.user_activity_logs (user_id, user_name, action, category, details, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    'User Registration',
    'Authentication',
    'New user account created with Student role - pending profile completion',
    'success'
  );
  
  RETURN new;
END;
$$;

-- Create function to approve user profile
CREATE OR REPLACE FUNCTION public.approve_user_profile(p_user_id uuid, p_approved_by uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_role TEXT;
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
    updated_at = now()
  WHERE id = p_user_id;

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

-- Create function to reject user profile
CREATE OR REPLACE FUNCTION public.reject_user_profile(p_user_id uuid, p_rejected_by uuid, p_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status ON public.profiles(approval_status);
CREATE INDEX IF NOT EXISTS idx_profiles_profile_completed ON public.profiles(profile_completed);
