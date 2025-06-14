
-- Create system_settings table for centralized configuration management
CREATE TABLE public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'general', 'student_management', 'attendance', etc.
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  branch_id UUID REFERENCES public.branches(id), -- For branch-specific settings (null = global)
  created_by UUID REFERENCES public.profiles(id),
  updated_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(category, key, branch_id)
);

-- Create settings history table for audit trail
CREATE TABLE public.system_settings_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_id UUID REFERENCES public.system_settings(id) ON DELETE CASCADE,
  old_value JSONB,
  new_value JSONB,
  changed_by UUID REFERENCES public.profiles(id),
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  change_reason TEXT
);

-- Add indexes for performance
CREATE INDEX idx_settings_category ON public.system_settings(category);
CREATE INDEX idx_settings_branch ON public.system_settings(branch_id);
CREATE INDEX idx_settings_updated ON public.system_settings(updated_at);
CREATE INDEX idx_settings_history_setting ON public.system_settings_history(setting_id);
CREATE INDEX idx_settings_history_changed ON public.system_settings_history(changed_at);

-- Enable RLS on both tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_settings
-- Super admins can access all settings
CREATE POLICY "Super admins can manage all settings"
ON public.system_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.user_roles ur ON p.role_id = ur.id
    WHERE p.id = auth.uid() 
    AND ur.name IN ('Super Admin', 'Admin')
  )
);

-- Branch admins can only access global settings (since we don't have branch_id in profiles yet)
CREATE POLICY "Branch admins can manage global settings"
ON public.system_settings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.user_roles ur ON p.role_id = ur.id
    WHERE p.id = auth.uid() 
    AND ur.name = 'Branch Admin'
    AND system_settings.branch_id IS NULL -- Only global settings for now
  )
);

-- RLS Policies for system_settings_history
-- Super admins can view all history
CREATE POLICY "Super admins can view all settings history"
ON public.system_settings_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.user_roles ur ON p.role_id = ur.id
    WHERE p.id = auth.uid() 
    AND ur.name IN ('Super Admin', 'Admin')
  )
);

-- Branch admins can view history for global settings
CREATE POLICY "Branch admins can view global settings history"
ON public.system_settings_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.user_roles ur ON p.role_id = ur.id
    JOIN public.system_settings ss ON system_settings_history.setting_id = ss.id
    WHERE p.id = auth.uid() 
    AND ur.name = 'Branch Admin'
    AND ss.branch_id IS NULL -- Only global settings for now
  )
);

-- Function to automatically log setting changes
CREATE OR REPLACE FUNCTION log_setting_change()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Trigger to automatically log changes
CREATE TRIGGER settings_change_log
  AFTER UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION log_setting_change();

-- Function to get setting with fallback hierarchy (branch -> global)
CREATE OR REPLACE FUNCTION get_setting_value(
  p_category TEXT,
  p_key TEXT,
  p_branch_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update setting with automatic history logging
CREATE OR REPLACE FUNCTION update_setting(
  p_category TEXT,
  p_key TEXT,
  p_value JSONB,
  p_branch_id UUID DEFAULT NULL,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS UUID AS $$
DECLARE
  setting_id UUID;
BEGIN
  -- Insert or update setting
  INSERT INTO public.system_settings (
    category,
    key,
    value,
    branch_id,
    created_by,
    updated_by
  ) VALUES (
    p_category,
    p_key,
    p_value,
    p_branch_id,
    p_user_id,
    p_user_id
  )
  ON CONFLICT (category, key, branch_id)
  DO UPDATE SET
    value = EXCLUDED.value,
    updated_by = EXCLUDED.updated_by,
    updated_at = now()
  RETURNING id INTO setting_id;
  
  RETURN setting_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default settings (fixed to handle case where no profiles exist)
INSERT INTO public.system_settings (category, key, value, created_by, updated_by) 
SELECT 
  category, key, value::jsonb, 
  COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid),
  COALESCE((SELECT id FROM public.profiles LIMIT 1), '00000000-0000-0000-0000-000000000000'::uuid)
FROM (VALUES
  -- General Settings
  ('general', 'academy_name', '"Australian Jiu-Jitsu Academy"'),
  ('general', 'academy_code', '"ADJJA"'),
  ('general', 'timezone', '"africa/cairo"'),
  ('general', 'currency', '"egp"'),
  ('general', 'default_attendance_buffer', '15'),
  
  -- Student Management Settings
  ('student_management', 'enable_student_checkin', 'true'),
  ('student_management', 'default_student_status', '"active"'),
  ('student_management', 'max_students_per_plan', '0'),
  
  -- Attendance Settings
  ('attendance', 'enable_instructor_validation', 'true'),
  ('attendance', 'late_threshold_minutes', '10'),
  ('attendance', 'auto_absence_minutes', '30'),
  
  -- Payment & Billing Settings
  ('payment', 'payment_reminder_interval_days', '7'),
  ('payment', 'allow_partial_payment', 'false'),
  ('payment', 'late_payment_fee_percentage', '5'),
  
  -- Subscription Plan Settings
  ('subscription', 'renewal_notification_days', '14'),
  ('subscription', 'allow_expired_plan_assignment', 'false'),
  ('subscription', 'allow_overlapping_subscriptions', 'false'),
  
  -- Analytics Settings
  ('analytics', 'enable_revenue_tracking', 'true'),
  ('analytics', 'enable_attendance_heatmap', 'true'),
  ('analytics', 'cache_refresh_interval_hours', '24'),
  
  -- Class & Schedule Settings
  ('class_schedule', 'default_class_duration_minutes', '60'),
  ('class_schedule', 'max_students_per_class', '30'),
  ('class_schedule', 'auto_cancel_threshold_students', '3'),
  
  -- Instructor Settings
  ('instructor', 'default_commission_rate', '20'),
  ('instructor', 'attendance_override_permission', 'true'),
  
  -- Notification Settings
  ('notifications', 'enable_email_notifications', 'true'),
  ('notifications', 'enable_sms_notifications', 'false'),
  ('notifications', 'plan_expiry_notification', 'true')
) AS default_settings(category, key, value);
