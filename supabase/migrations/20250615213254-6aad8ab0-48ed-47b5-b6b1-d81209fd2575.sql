
-- Update RLS policies for coach_profiles table to allow Super Admin access

-- Drop existing policies to recreate them with proper permissions
DROP POLICY IF EXISTS "Coaches can view all coach profiles" ON public.coach_profiles;
DROP POLICY IF EXISTS "Users can manage their own coach profile" ON public.coach_profiles;

-- Create comprehensive policies for coach_profiles

-- Policy 1: Allow Super Admins to manage all coach profiles (all operations)
CREATE POLICY "Super Admins can manage all coach profiles" ON public.coach_profiles
FOR ALL USING (
  public.get_current_user_role() = 'Super Admin'
) WITH CHECK (
  public.get_current_user_role() = 'Super Admin'
);

-- Policy 2: Allow users to manage their own coach profile
CREATE POLICY "Users can manage their own coach profile" ON public.coach_profiles
FOR ALL USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

-- Policy 3: Allow all authenticated users to view coach profiles
CREATE POLICY "Coaches can view all coach profiles" ON public.coach_profiles
FOR SELECT USING (
  auth.role() = 'authenticated'
);
