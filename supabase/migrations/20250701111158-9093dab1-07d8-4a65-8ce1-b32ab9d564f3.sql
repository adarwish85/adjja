
-- Create missing RPC functions for system settings management

-- Function to update or create system settings
CREATE OR REPLACE FUNCTION public.update_setting(
  p_category TEXT,
  p_key TEXT,
  p_value JSONB,
  p_branch_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  setting_id UUID;
  current_user_id UUID := auth.uid();
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
    current_user_id,
    current_user_id
  )
  ON CONFLICT (category, key, COALESCE(branch_id, '00000000-0000-0000-0000-000000000000'::uuid))
  DO UPDATE SET
    value = EXCLUDED.value,
    updated_by = EXCLUDED.updated_by,
    updated_at = now()
  RETURNING id INTO setting_id;
  
  RETURN setting_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get setting value with fallback hierarchy
CREATE OR REPLACE FUNCTION public.get_setting_value_safe(
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_settings_category_key ON public.system_settings(category, key);
CREATE INDEX IF NOT EXISTS idx_system_settings_branch_category ON public.system_settings(branch_id, category) WHERE branch_id IS NOT NULL;
