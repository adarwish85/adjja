
-- Drop the trigger first, then the function
DROP TRIGGER IF EXISTS trigger_update_student_class_enrollment ON public.class_enrollments;
DROP FUNCTION IF EXISTS public.update_student_class_enrollment();

-- First, migrate existing single enrollments to the class_enrollments table
INSERT INTO public.class_enrollments (student_id, class_id, status, enrollment_date)
SELECT 
    id as student_id,
    class_enrollment as class_id,
    'active' as status,
    created_at as enrollment_date
FROM public.students 
WHERE class_enrollment IS NOT NULL
ON CONFLICT (student_id, class_id) DO NOTHING;

-- Remove the deprecated class_enrollment column from students table
ALTER TABLE public.students DROP COLUMN IF EXISTS class_enrollment;
