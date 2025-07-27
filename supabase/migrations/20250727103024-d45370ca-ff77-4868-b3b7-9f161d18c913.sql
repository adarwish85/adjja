-- Critical Security Fix Phase 1: Database Security
-- Fix 1: Secure RLS policies for coaches table
DROP POLICY IF EXISTS "Authenticated users can view coaches" ON public.coaches;
DROP POLICY IF EXISTS "Authenticated users can insert coaches" ON public.coaches;
DROP POLICY IF EXISTS "Authenticated users can update coaches" ON public.coaches;
DROP POLICY IF EXISTS "Authenticated users can delete coaches" ON public.coaches;

-- Create proper role-based policies for coaches table
CREATE POLICY "Super Admin can manage all coaches" 
ON public.coaches 
FOR ALL 
USING (get_current_user_role() = 'Super Admin')
WITH CHECK (get_current_user_role() = 'Super Admin');

CREATE POLICY "Coaches can view all coaches" 
ON public.coaches 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  JOIN user_roles ur ON p.role_id = ur.id 
  WHERE p.id = auth.uid() AND ur.name IN ('Coach', 'Super Admin')
));

-- Fix 2: Add missing search_path to remaining functions
CREATE OR REPLACE FUNCTION public.create_enrollment_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  student_role_id UUID;
BEGIN
  -- Get the Student role ID
  SELECT id INTO student_role_id FROM public.user_roles WHERE name = 'Student' LIMIT 1;
  
  -- If Student role doesn't exist, create it
  IF student_role_id IS NULL THEN
    INSERT INTO public.user_roles (name, description, is_system)
    VALUES ('Student', 'Default student role', true)
    RETURNING id INTO student_role_id;
  END IF;
  
  -- Insert into profiles table with Student role and pending status
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    role_id, 
    status, 
    approval_status, 
    mandatory_fields_completed,
    profile_completed
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    student_role_id,
    'active',
    'pending',
    false,
    false
  );
  
  -- Log the registration activity
  INSERT INTO public.user_activity_logs (user_id, user_name, action, category, details, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'User Registration',
    'Authentication',
    'New user account created - pending profile approval',
    'success'
  );
  
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_setting_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.value IS DISTINCT FROM NEW.value THEN
    INSERT INTO public.system_settings_history (
      setting_id,
      old_value,
      new_value,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      OLD.value,
      NEW.value,
      NEW.updated_by,
      'Setting updated'
    );
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_course_enrollment_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
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
$function$;

-- Fix 3: Strengthen attendance_records RLS
DROP POLICY IF EXISTS "Users can view attendance records" ON public.attendance_records;

CREATE POLICY "Super Admin can manage all attendance records" 
ON public.attendance_records 
FOR ALL 
USING (get_current_user_role() = 'Super Admin')
WITH CHECK (get_current_user_role() = 'Super Admin');

CREATE POLICY "Coaches can view attendance records" 
ON public.attendance_records 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles p 
  JOIN user_roles ur ON p.role_id = ur.id 
  WHERE p.id = auth.uid() AND ur.name IN ('Coach', 'Super Admin')
));

CREATE POLICY "Students can view their own attendance" 
ON public.attendance_records 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM students s 
  WHERE s.id = attendance_records.student_id AND s.auth_user_id = auth.uid()
));

-- Fix 4: Add security audit table for monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  resource TEXT,
  ip_address INET,
  user_agent TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only Super Admin can view security audit logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (get_current_user_role() = 'Super Admin');

CREATE POLICY "System can insert security audit logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (true);