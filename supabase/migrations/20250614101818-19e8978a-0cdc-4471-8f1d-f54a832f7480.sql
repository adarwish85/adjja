
-- Update Ahmed Darwish to be Super Admin (remove from Ali Al Shinnawy)
UPDATE public.profiles 
SET role_id = (SELECT id FROM public.user_roles WHERE name = 'Super Admin')
WHERE email = 'Ahmeddarwesh@gmail.com';

-- Reset Ali Al Shinnawy back to Student role
UPDATE public.profiles 
SET role_id = (SELECT id FROM public.user_roles WHERE name = 'Student')
WHERE email = 'alielshenawy@gmail.com';

-- Verify the updates worked
SELECT p.name, p.email, ur.name as role_name 
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.role_id = ur.id
WHERE p.email IN ('Ahmeddarwesh@gmail.com', 'alielshenawy@gmail.com')
ORDER BY p.email;
