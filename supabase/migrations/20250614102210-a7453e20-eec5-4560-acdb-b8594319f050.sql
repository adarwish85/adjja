
-- Enhance course_enrollments table with missing fields
ALTER TABLE public.course_enrollments 
ADD COLUMN IF NOT EXISTS enrolled_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS note TEXT;

-- Update existing records to have enrolled_by as the student (fallback)
UPDATE public.course_enrollments 
SET enrolled_by = student_id 
WHERE enrolled_by IS NULL;

-- Create notifications table for in-app notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  type TEXT DEFAULT 'info',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications - users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for course_enrollments - enhanced for role-based access
CREATE POLICY "Super Admin can manage all enrollments" 
  ON public.course_enrollments 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.user_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Super Admin'
    )
  );

CREATE POLICY "Coaches can manage enrollments for their courses" 
  ON public.course_enrollments 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.user_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Coach'
    )
  );

-- Function to create enrollment notification
CREATE OR REPLACE FUNCTION public.create_enrollment_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for the enrolled student
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.student_id,
    'Course Enrollment',
    'You have been enrolled in a new course. Check your course dashboard for details.',
    'enrollment'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create notifications on enrollment
DROP TRIGGER IF EXISTS enrollment_notification_trigger ON public.course_enrollments;
CREATE TRIGGER enrollment_notification_trigger
  AFTER INSERT ON public.course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.create_enrollment_notification();
