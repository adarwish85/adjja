
-- Create downgrade_coach_to_student function
CREATE OR REPLACE FUNCTION public.downgrade_coach_to_student(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Grant EXECUTE on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.downgrade_coach_to_student(uuid) TO authenticated;
