-- Fix the role assignment for the admin account
-- Update ahmeddarwesh@gmail.com to have Super Admin role
UPDATE public.profiles 
SET role_id = (SELECT id FROM public.user_roles WHERE name = 'Super Admin' LIMIT 1),
    updated_at = now()
WHERE email = 'ahmeddarwesh@gmail.com';