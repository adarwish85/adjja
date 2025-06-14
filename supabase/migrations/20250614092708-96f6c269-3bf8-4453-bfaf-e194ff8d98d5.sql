
-- Create attendance_records table to track actual class attendance
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  class_id UUID NOT NULL REFERENCES public.classes(id),
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  marked_by UUID REFERENCES public.profiles(id),
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_attendance_records_student_id ON public.attendance_records(student_id);
CREATE INDEX idx_attendance_records_class_id ON public.attendance_records(class_id);
CREATE INDEX idx_attendance_records_date ON public.attendance_records(attendance_date);

-- Enable RLS
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Create policy for attendance records
CREATE POLICY "Users can view attendance records" 
  ON public.attendance_records 
  FOR SELECT 
  USING (true);

-- Create materialized view for student analytics
CREATE MATERIALIZED VIEW public.analytics_student_metrics AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_students,
  COUNT(*) FILTER (WHERE status = 'active') as active_students,
  COUNT(*) FILTER (WHERE status = 'inactive') as inactive_students
FROM public.students
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Create materialized view for revenue analytics
CREATE MATERIALIZED VIEW public.analytics_revenue_metrics AS
SELECT 
  DATE_TRUNC('month', pt.transaction_date) as month,
  SUM(pt.amount) as total_revenue,
  COUNT(*) as transaction_count,
  sp.title as plan_name,
  sp.subscription_period
FROM public.payment_transactions pt
JOIN public.subscription_plans sp ON pt.subscription_plan_id = sp.id
WHERE pt.status = 'completed'
GROUP BY DATE_TRUNC('month', pt.transaction_date), sp.id, sp.title, sp.subscription_period
ORDER BY month;

-- Create materialized view for class performance
CREATE MATERIALIZED VIEW public.analytics_class_performance AS
SELECT 
  c.id as class_id,
  c.name as class_name,
  c.instructor,
  c.capacity,
  c.enrolled,
  ROUND((c.enrolled::DECIMAL / c.capacity) * 100, 2) as utilization_percentage,
  COUNT(ar.id) as total_attendances,
  COUNT(ar.id) FILTER (WHERE ar.status = 'present') as present_count,
  COUNT(ar.id) FILTER (WHERE ar.status = 'absent') as absent_count
FROM public.classes c
LEFT JOIN public.attendance_records ar ON c.id = ar.class_id
GROUP BY c.id, c.name, c.instructor, c.capacity, c.enrolled;

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION public.refresh_analytics_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.analytics_student_metrics;
  REFRESH MATERIALIZED VIEW public.analytics_revenue_metrics;
  REFRESH MATERIALIZED VIEW public.analytics_class_performance;
END;
$$;

-- Create function to get attendance heatmap data
CREATE OR REPLACE FUNCTION public.get_attendance_heatmap(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  day_of_week INTEGER,
  hour_of_day INTEGER,
  attendance_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;
