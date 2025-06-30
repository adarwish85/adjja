
-- Fix Super Admin Profile Creation
-- This ensures the Super Admin profile exists with correct permissions

-- First, ensure Super Admin role exists
INSERT INTO public.user_roles (name, description, is_system, permissions) 
VALUES ('Super Admin', 'System administrator with full access', true, ARRAY['*'])
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  is_system = EXCLUDED.is_system,
  permissions = EXCLUDED.permissions;

-- Create or update the Super Admin profile for Ahmeddarwesh@gmail.com
DO $$
DECLARE
  super_admin_role_id UUID;
  admin_user_id UUID;
BEGIN
  -- Get the Super Admin role ID
  SELECT id INTO super_admin_role_id FROM public.user_roles WHERE name = 'Super Admin';
  
  -- Get the user ID for the Super Admin email
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'Ahmeddarwesh@gmail.com';
  
  -- Only proceed if we found both the role and the user
  IF super_admin_role_id IS NOT NULL AND admin_user_id IS NOT NULL THEN
    -- Insert or update the Super Admin profile
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
      admin_user_id,
      'Ahmed Darwish',
      'Ahmeddarwesh@gmail.com',
      super_admin_role_id,
      'active',
      'approved',
      true,
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      role_id = EXCLUDED.role_id,
      approval_status = EXCLUDED.approval_status,
      mandatory_fields_completed = EXCLUDED.mandatory_fields_completed,
      profile_completed = EXCLUDED.profile_completed,
      updated_at = now();
  END IF;
END $$;
