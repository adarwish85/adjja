-- Fix remaining security issues identified by linter

-- Fix 1: Enable RLS on tables that don't have it enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Fix 2: Add search_path to remaining functions that need it
CREATE OR REPLACE FUNCTION public.calculate_next_due_date(period_type text, from_date timestamp with time zone DEFAULT now())
RETURNS timestamp with time zone
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  CASE period_type
    WHEN 'weekly' THEN
      RETURN from_date + INTERVAL '1 week';
    WHEN 'monthly' THEN
      RETURN from_date + INTERVAL '1 month';
    WHEN 'quarterly' THEN
      RETURN from_date + INTERVAL '3 months';
    WHEN 'yearly' THEN
      RETURN from_date + INTERVAL '1 year';
    ELSE
      RETURN from_date + INTERVAL '1 month'; -- default to monthly
  END CASE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_calculate_student_due_date()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  -- Only update if subscription_plan_id or plan_start_date changed
  IF (TG_OP = 'INSERT') OR 
     (TG_OP = 'UPDATE' AND (
       OLD.subscription_plan_id IS DISTINCT FROM NEW.subscription_plan_id OR
       OLD.plan_start_date IS DISTINCT FROM NEW.plan_start_date
     )) THEN
    
    -- Calculate and set next_due_date if we have both plan and start date
    IF NEW.subscription_plan_id IS NOT NULL AND NEW.plan_start_date IS NOT NULL THEN
      NEW.next_due_date := public.calculate_next_due_date_for_student(
        COALESCE(NEW.id, gen_random_uuid()), 
        NEW.plan_start_date
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.auto_generate_profile_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  user_name text;
BEGIN
  -- Only generate slug if profile is being made public and slug is null
  IF NEW.is_public = true AND (OLD.is_public = false OR OLD.is_public IS NULL) AND NEW.profile_slug IS NULL THEN
    -- Get user name from profiles table
    SELECT name INTO user_name FROM public.profiles WHERE id = NEW.user_id;
    
    -- Generate unique slug
    NEW.profile_slug := public.generate_profile_slug(NEW.user_id, COALESCE(user_name, 'athlete'));
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_next_due_date_for_student(p_student_id uuid, p_start_date date DEFAULT CURRENT_DATE)
RETURNS timestamp with time zone
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  plan_period TEXT;
  result_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the subscription period from the student's assigned plan
  SELECT sp.subscription_period INTO plan_period
  FROM public.students s
  JOIN public.subscription_plans sp ON s.subscription_plan_id = sp.id
  WHERE s.id = p_student_id;
  
  -- If no plan assigned, default to monthly
  IF plan_period IS NULL THEN
    plan_period := 'monthly';
  END IF;
  
  -- Calculate next due date based on period
  CASE plan_period
    WHEN 'weekly' THEN
      result_date := p_start_date + INTERVAL '1 week';
    WHEN 'monthly' THEN
      result_date := p_start_date + INTERVAL '1 month';
    WHEN 'quarterly' THEN
      result_date := p_start_date + INTERVAL '3 months';
    WHEN 'yearly' THEN
      result_date := p_start_date + INTERVAL '1 year';
    ELSE
      result_date := p_start_date + INTERVAL '1 month';
  END CASE;
  
  RETURN result_date;
END;
$function$;

CREATE OR REPLACE FUNCTION public.enroll_student_in_class(p_student_id uuid, p_class_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  enrollment_id UUID;
BEGIN
  -- Insert or update enrollment
  INSERT INTO public.class_enrollments (student_id, class_id, status)
  VALUES (p_student_id, p_class_id, 'active')
  ON CONFLICT (student_id, class_id) 
  DO UPDATE SET 
    status = 'active',
    enrollment_date = now(),
    updated_at = now()
  RETURNING id INTO enrollment_id;
  
  RETURN enrollment_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_profile_slug(p_user_id uuid, p_name text)
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $function$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Create base slug from name
  base_slug := lower(regexp_replace(trim(p_name), '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(base_slug, '-');
  
  -- If empty, use user_id
  IF base_slug = '' THEN
    base_slug := 'athlete-' || substring(p_user_id::text, 1, 8);
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append counter if needed
  WHILE EXISTS (SELECT 1 FROM public.bjj_profiles WHERE profile_slug = final_slug AND user_id != p_user_id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_attendance_heatmap(start_date date DEFAULT (CURRENT_DATE - '30 days'::interval), end_date date DEFAULT CURRENT_DATE)
RETURNS TABLE(day_of_week integer, hour_of_day integer, attendance_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    EXTRACT(DOW FROM ar.attendance_date)::INTEGER as day_of_week,
    EXTRACT(HOUR FROM ar.marked_at)::INTEGER as hour_of_day,
    COUNT(*)::BIGINT as attendance_count
  FROM public.attendance_records ar
  WHERE ar.attendance_date BETWEEN start_date AND end_date
    AND ar.status = 'present'
  GROUP BY EXTRACT(DOW FROM ar.attendance_date), EXTRACT(HOUR FROM ar.marked_at)
  ORDER BY day_of_week, hour_of_day;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_available_classes_for_student(p_student_id uuid)
RETURNS TABLE(class_id uuid, class_name text, instructor text, schedule text, already_checked_in boolean, is_enrolled boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as class_id,
    c.name as class_name,
    c.instructor,
    c.schedule,
    (ar.id IS NOT NULL) as already_checked_in,
    (ce.id IS NOT NULL) as is_enrolled
  FROM public.classes c
  LEFT JOIN public.class_enrollments ce ON c.id = ce.class_id 
    AND ce.student_id = p_student_id 
    AND ce.status = 'active'
  LEFT JOIN public.attendance_records ar ON c.id = ar.class_id 
    AND ar.student_id = p_student_id 
    AND ar.attendance_date = CURRENT_DATE
  WHERE c.status = 'Active'
  ORDER BY c.name;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_setting_value_safe(p_category text, p_key text, p_branch_id uuid DEFAULT NULL::uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  result JSONB;
BEGIN
  -- First try to get branch-specific setting
  IF p_branch_id IS NOT NULL THEN
    SELECT value INTO result
    FROM public.system_settings
    WHERE category = p_category
      AND key = p_key
      AND branch_id = p_branch_id;
  END IF;
  
  -- If no branch-specific setting found, get global setting
  IF result IS NULL THEN
    SELECT value INTO result
    FROM public.system_settings
    WHERE category = p_category
      AND key = p_key
      AND branch_id IS NULL;
  END IF;
  
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_student_payment_status()
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  -- Update students to 'overdue' if past due date
  UPDATE public.students 
  SET payment_status = 'overdue'
  WHERE next_due_date < CURRENT_DATE 
    AND payment_status != 'overdue';
  
  -- Update students to 'due_soon' if due within 3 days
  UPDATE public.students 
  SET payment_status = 'due_soon'
  WHERE next_due_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '3 days')
    AND payment_status = 'paid';
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Hide materialized views from API by revoking permissions
REVOKE ALL ON public.analytics_student_metrics FROM anon, authenticated;
REVOKE ALL ON public.analytics_revenue_metrics FROM anon, authenticated;
REVOKE ALL ON public.analytics_class_performance FROM anon, authenticated;
REVOKE ALL ON public.student_attendance_stats FROM anon, authenticated;