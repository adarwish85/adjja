-- Enable RLS on unprotected tables and add security policies

-- Enable RLS on classes table
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Classes policies
CREATE POLICY "Students can view active classes" ON public.classes
  FOR SELECT 
  USING (status = 'Active');

CREATE POLICY "Coaches can view all classes" ON public.classes
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles p 
    JOIN user_roles ur ON p.role_id = ur.id 
    WHERE p.id = auth.uid() AND ur.name IN ('Coach', 'Super Admin')
  ));

CREATE POLICY "Super Admin can manage all classes" ON public.classes
  FOR ALL 
  USING (get_current_user_role() = 'Super Admin')
  WITH CHECK (get_current_user_role() = 'Super Admin');

-- Enable RLS on class_enrollments table
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;

-- Class enrollments policies
CREATE POLICY "Students can view their own enrollments" ON public.class_enrollments
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM students s 
    WHERE s.id = class_enrollments.student_id 
    AND s.auth_user_id = auth.uid()
  ));

CREATE POLICY "Coaches can view enrollments for their classes" ON public.class_enrollments
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM classes c 
    JOIN profiles p ON c.instructor = p.name 
    WHERE c.id = class_enrollments.class_id 
    AND p.id = auth.uid()
  ));

CREATE POLICY "Super Admin can manage all enrollments" ON public.class_enrollments
  FOR ALL 
  USING (get_current_user_role() = 'Super Admin')
  WITH CHECK (get_current_user_role() = 'Super Admin');

-- Enable RLS on course_topics table
ALTER TABLE public.course_topics ENABLE ROW LEVEL SECURITY;

-- Course topics policies
CREATE POLICY "Users can view course topics for enrolled courses" ON public.course_topics
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM course_enrollments ce 
    JOIN students s ON ce.student_id = s.id 
    WHERE ce.course_id = course_topics.course_id 
    AND s.auth_user_id = auth.uid() 
    AND ce.status = 'Active'
  ));

CREATE POLICY "Coaches can view all course topics" ON public.course_topics
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles p 
    JOIN user_roles ur ON p.role_id = ur.id 
    WHERE p.id = auth.uid() AND ur.name IN ('Coach', 'Super Admin')
  ));

CREATE POLICY "Super Admin can manage all course topics" ON public.course_topics
  FOR ALL 
  USING (get_current_user_role() = 'Super Admin')
  WITH CHECK (get_current_user_role() = 'Super Admin');

-- Enable RLS on course_lessons table
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

-- Course lessons policies
CREATE POLICY "Users can view lessons for enrolled courses" ON public.course_lessons
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM course_topics ct 
    JOIN course_enrollments ce ON ct.course_id = ce.course_id 
    JOIN students s ON ce.student_id = s.id 
    WHERE ct.id = course_lessons.topic_id 
    AND s.auth_user_id = auth.uid() 
    AND ce.status = 'Active'
  ));

CREATE POLICY "Coaches can view all course lessons" ON public.course_lessons
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles p 
    JOIN user_roles ur ON p.role_id = ur.id 
    WHERE p.id = auth.uid() AND ur.name IN ('Coach', 'Super Admin')
  ));

CREATE POLICY "Super Admin can manage all course lessons" ON public.course_lessons
  FOR ALL 
  USING (get_current_user_role() = 'Super Admin')
  WITH CHECK (get_current_user_role() = 'Super Admin');

-- Enable RLS on course_quizzes table
ALTER TABLE public.course_quizzes ENABLE ROW LEVEL SECURITY;

-- Course quizzes policies
CREATE POLICY "Users can view quizzes for enrolled courses" ON public.course_quizzes
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM course_topics ct 
    JOIN course_enrollments ce ON ct.course_id = ce.course_id 
    JOIN students s ON ce.student_id = s.id 
    WHERE ct.id = course_quizzes.topic_id 
    AND s.auth_user_id = auth.uid() 
    AND ce.status = 'Active'
  ));

CREATE POLICY "Coaches can view all course quizzes" ON public.course_quizzes
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles p 
    JOIN user_roles ur ON p.role_id = ur.id 
    WHERE p.id = auth.uid() AND ur.name IN ('Coach', 'Super Admin')
  ));

CREATE POLICY "Super Admin can manage all course quizzes" ON public.course_quizzes
  FOR ALL 
  USING (get_current_user_role() = 'Super Admin')
  WITH CHECK (get_current_user_role() = 'Super Admin');

-- Enable RLS on quiz_questions table
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Quiz questions policies
CREATE POLICY "Users can view questions for enrolled course quizzes" ON public.quiz_questions
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM course_quizzes cq 
    JOIN course_topics ct ON cq.topic_id = ct.id 
    JOIN course_enrollments ce ON ct.course_id = ce.course_id 
    JOIN students s ON ce.student_id = s.id 
    WHERE cq.id = quiz_questions.quiz_id 
    AND s.auth_user_id = auth.uid() 
    AND ce.status = 'Active'
  ));

CREATE POLICY "Coaches can view all quiz questions" ON public.quiz_questions
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles p 
    JOIN user_roles ur ON p.role_id = ur.id 
    WHERE p.id = auth.uid() AND ur.name IN ('Coach', 'Super Admin')
  ));

CREATE POLICY "Super Admin can manage all quiz questions" ON public.quiz_questions
  FOR ALL 
  USING (get_current_user_role() = 'Super Admin')
  WITH CHECK (get_current_user_role() = 'Super Admin');

-- Update existing database functions to include proper search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT ur.name
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  LEFT JOIN public.user_roles ur ON p.role_id = ur.id
  WHERE au.id = auth.uid();
$function$;