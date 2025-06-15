
-- 1. Create or replace a SECURITY DEFINER function to safely get the current user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT ur.name
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  LEFT JOIN public.user_roles ur ON p.role_id = ur.id
  WHERE au.id = auth.uid();
$$;

-- 2. Recreate the upgrade function with verbose debug checks
DROP FUNCTION IF EXISTS public.upgrade_user_to_coach(uuid);

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

  IF current_user_role IS NULL THEN
    RAISE EXCEPTION 'Could not determine current user role. Value: %', current_user_role;
  END IF;

  IF current_user_role != 'Super Admin' THEN
    RAISE EXCEPTION 'Only Super Admin can upgrade users to Coach. Role found: %', current_user_role;
  END IF;

  -- Get the Coach role ID
  SELECT id INTO coach_role_id FROM public.user_roles WHERE name = 'Coach' LIMIT 1;

  IF coach_role_id IS NULL THEN
    RAISE EXCEPTION 'Coach role does not exist in user_roles';
  END IF;

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

-- 3. Grant execute privilege again
GRANT EXECUTE ON FUNCTION public.upgrade_user_to_coach(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
