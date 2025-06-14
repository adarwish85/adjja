
-- Create a function to update course enrollment count
CREATE OR REPLACE FUNCTION public.update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the total_students count for the affected course
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.courses 
    SET total_students = (
      SELECT COUNT(*) 
      FROM public.course_enrollments 
      WHERE course_id = NEW.course_id AND status = 'Active'
    ),
    updated_at = now()
    WHERE id = NEW.course_id;
  END IF;
  
  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.course_id != NEW.course_id) THEN
    UPDATE public.courses 
    SET total_students = (
      SELECT COUNT(*) 
      FROM public.course_enrollments 
      WHERE course_id = OLD.course_id AND status = 'Active'
    ),
    updated_at = now()
    WHERE id = OLD.course_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update course enrollment count
DROP TRIGGER IF EXISTS course_enrollment_count_trigger ON public.course_enrollments;
CREATE TRIGGER course_enrollment_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_course_enrollment_count();
