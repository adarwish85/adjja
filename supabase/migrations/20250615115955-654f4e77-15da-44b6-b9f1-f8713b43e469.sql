
-- DROP the existing function if it exists to prevent signature conflicts
DROP FUNCTION IF EXISTS public.upgrade_user_to_coach(uuid);

-- Make sure we have a "get_current_user_role" security definer function with STABLE and SECURITY DEFINER attributes
-- This should already exist, but include for completeness; otherwise, the policy may loop

-- Now, redefine "upgrade_user_to_coach" with better definer isolation
CREATE OR REPLACE FUNCTION public.upgrade_user_to_coach(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  coach_role_id UUID;
  current_user_role TEXT;
BEGIN
  -- Use a security definer function to check current user role safely
  SELECT public.get_current_user_role() INTO current_user_role;

  IF current_user_role != 'Super Admin' THEN
    RAISE EXCEPTION 'Only Super Admin can upgrade users to Coach';
  END IF;

  -- Get the Coach role ID
  SELECT id INTO coach_role_id FROM public.user_roles WHERE name = 'Coach' LIMIT 1;

  -- Update user role to Coach
  UPDATE public.profiles 
  SET role_id = coach_role_id, updated_at = now()
  WHERE id = p_user_id;

  -- Create coach profile entry
  INSERT INTO public.coach_profiles (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN FOUND;
END;
$$;

-- Grant EXECUTE permission for authenticated users
GRANT EXECUTE ON FUNCTION public.upgrade_user_to_coach(uuid) TO authenticated;
