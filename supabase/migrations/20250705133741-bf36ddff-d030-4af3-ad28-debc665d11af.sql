
-- Phase 1: Update RLS policy to allow Super Admin access to all students
DROP POLICY IF EXISTS "Only approved users can have student records" ON public.students;

CREATE POLICY "Students table access control" 
ON public.students 
FOR ALL
USING (
  -- Super Admins can see all students regardless of approval status
  (public.get_current_user_role() = 'Super Admin') OR
  -- Regular users can only see records for approved profiles
  (EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = students.auth_user_id 
    AND p.approval_status = 'approved'
  ))
);

-- Phase 2: Auto-approve existing students to fix data inconsistencies
-- This will make Mohamed Hassan and other existing students visible again
UPDATE public.profiles 
SET 
  approval_status = 'approved',
  approved_at = now(),
  mandatory_fields_completed = true,
  profile_completed = true,
  updated_at = now()
WHERE id IN (
  SELECT DISTINCT s.auth_user_id 
  FROM public.students s 
  JOIN public.profiles p ON s.auth_user_id = p.id
  WHERE p.approval_status = 'pending' 
  AND s.status = 'active'
  AND s.auth_user_id IS NOT NULL
);
