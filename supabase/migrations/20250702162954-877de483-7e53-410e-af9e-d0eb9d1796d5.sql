
-- Create function to update coach student counts
CREATE OR REPLACE FUNCTION update_coach_student_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update traditional coaches student counts
  UPDATE coaches 
  SET students_count = (
    SELECT COALESCE(direct_students.count, 0) + COALESCE(class_students.count, 0)
    FROM (
      -- Count direct students assigned to this coach
      SELECT COUNT(*) as count
      FROM students s
      WHERE s.coach = coaches.name 
        AND s.status = 'active'
    ) direct_students,
    (
      -- Count students enrolled in classes where this coach is instructor
      SELECT COUNT(DISTINCT ce.student_id) as count
      FROM classes c
      JOIN class_enrollments ce ON c.id = ce.class_id
      JOIN students s ON ce.student_id = s.id
      WHERE c.instructor = coaches.name 
        AND c.status = 'Active'
        AND ce.status = 'active'
        AND s.status = 'active'
    ) class_students
  );
  
  -- Update coach profiles for upgraded student-coaches
  UPDATE coach_profiles 
  SET assigned_classes = COALESCE(
    (SELECT ARRAY_AGG(DISTINCT c.name) 
     FROM classes c 
     JOIN profiles p ON p.id = coach_profiles.user_id
     WHERE c.instructor = p.name 
       AND c.status = 'Active'), 
    '{}'::text[]
  );
END;
$$;

-- Create trigger function for student changes
CREATE OR REPLACE FUNCTION trigger_update_coach_counts()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Call the update function
  PERFORM update_coach_student_counts();
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger function for class enrollment changes
CREATE OR REPLACE FUNCTION trigger_update_coach_counts_enrollment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Call the update function
  PERFORM update_coach_student_counts();
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger function for class changes
CREATE OR REPLACE FUNCTION trigger_update_coach_counts_classes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Call the update function when instructor changes
  IF TG_OP = 'UPDATE' AND OLD.instructor IS DISTINCT FROM NEW.instructor THEN
    PERFORM update_coach_student_counts();
  ELSIF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
    PERFORM update_coach_student_counts();
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS student_coach_count_trigger ON students;
DROP TRIGGER IF EXISTS enrollment_coach_count_trigger ON class_enrollments;
DROP TRIGGER IF EXISTS class_coach_count_trigger ON classes;

-- Create triggers for automatic updates
CREATE TRIGGER student_coach_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON students
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_coach_counts();

CREATE TRIGGER enrollment_coach_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON class_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_coach_counts_enrollment();

CREATE TRIGGER class_coach_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_coach_counts_classes();

-- Initial update of all coach student counts
SELECT update_coach_student_counts();
