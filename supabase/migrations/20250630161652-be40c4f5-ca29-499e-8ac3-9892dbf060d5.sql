
-- Fix Super Admin Profile Status
-- Update the profile for ahmeddarwesh@gmail.com to have correct status values

UPDATE public.profiles 
SET 
  approval_status = 'approved',
  status = 'active', 
  profile_completed = true,
  approved_at = now(),
  updated_at = now()
WHERE id = 'b03250b2-207b-4f57-a10c-4bf21d45d8d7' 
  AND email = 'Ahmeddarwesh@gmail.com';

-- Verify the update worked
SELECT 
  id, 
  email, 
  status, 
  approval_status, 
  profile_completed,
  mandatory_fields_completed,
  approved_at
FROM public.profiles 
WHERE email = 'Ahmeddarwesh@gmail.com';
