
-- Add plan_start_date to students table
ALTER TABLE public.students ADD COLUMN plan_start_date DATE;

-- Update the calculate_next_due_date function to work with subscription plans
CREATE OR REPLACE FUNCTION public.calculate_next_due_date_for_student(
  p_student_id UUID,
  p_start_date DATE DEFAULT CURRENT_DATE
)
RETURNS TIMESTAMP WITH TIME ZONE
LANGUAGE plpgsql
AS $$
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
$$;

-- Function to update student payment status based on due dates
CREATE OR REPLACE FUNCTION public.update_student_payment_status()
RETURNS void
LANGUAGE plpgsql
AS $$
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
$$;

-- Create trigger to auto-calculate next_due_date when subscription plan or start date changes
CREATE OR REPLACE FUNCTION public.auto_calculate_student_due_date()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
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
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_auto_calculate_due_date ON public.students;
CREATE TRIGGER trigger_auto_calculate_due_date
  BEFORE INSERT OR UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.auto_calculate_student_due_date();

-- Update payment_status enum to include new statuses
ALTER TABLE public.students DROP CONSTRAINT IF EXISTS students_payment_status_check;
ALTER TABLE public.students ADD CONSTRAINT students_payment_status_check 
  CHECK (payment_status IN ('unpaid', 'paid', 'due_soon', 'overdue'));
