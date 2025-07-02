
-- Fix the update_coach_student_counts function with proper WHERE clause and correlated subqueries
CREATE OR REPLACE FUNCTION update_coach_student_counts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update traditional coaches student counts with proper WHERE clause
  UPDATE coaches 
  SET students_count = (
    -- Count direct students assigned to this specific coach
    SELECT COALESCE(COUNT(*), 0)
    FROM students s
    WHERE s.coach = coaches.name 
      AND s.status = 'active'
  ) + (
    -- Count students enrolled in classes where this specific coach is instructor
    SELECT COALESCE(COUNT(DISTINCT ce.student_id), 0)
    FROM classes c
    JOIN class_enrollments ce ON c.id = ce.class_id
    JOIN students s ON ce.student_id = s.id
    WHERE c.instructor = coaches.name 
      AND c.status = 'Active'
      AND ce.status = 'active'
      AND s.status = 'active'
  )
  WHERE coaches.id IS NOT NULL; -- Proper WHERE clause to avoid the error
  
  -- Update coach profiles for upgraded student-coaches with proper WHERE clause
  UPDATE coach_profiles 
  SET assigned_classes = COALESCE(
    (SELECT ARRAY_AGG(DISTINCT c.name) 
     FROM classes c 
     JOIN profiles p ON p.id = coach_profiles.user_id
     WHERE c.instructor = p.name 
       AND c.status = 'Active'), 
    '{}'::text[]
  )
  WHERE coach_profiles.user_id IS NOT NULL; -- Proper WHERE clause
END;
$$;
