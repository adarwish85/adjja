
-- Update Ali Al Shinnawy to be Super Admin
UPDATE public.profiles 
SET role_id = (SELECT id FROM public.user_roles WHERE name = 'Super Admin')
WHERE email = 'alielshenawy@gmail.com';

-- Verify the update worked by checking the user's role
SELECT p.name, p.email, ur.name as role_name 
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.role_id = ur.id
WHERE p.email = 'alielshenawy@gmail.com';
