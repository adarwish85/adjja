
-- Fix the enrollment notification function to properly map student to auth user
CREATE OR REPLACE FUNCTION public.create_enrollment_notification()
RETURNS TRIGGER AS $$
DECLARE
  auth_user_id UUID;
BEGIN
  -- Find the auth.users.id based on the student's email
  SELECT au.id INTO auth_user_id
  FROM public.students s
  JOIN auth.users au ON s.email = au.email
  WHERE s.id = NEW.student_id;
  
  -- Only create notification if we found a matching auth user
  IF auth_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      auth_user_id,
      'Course Enrollment',
      'You have been enrolled in a new course. Check your course dashboard for details.',
      'enrollment'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
