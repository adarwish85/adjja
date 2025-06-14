
-- Insert default theme settings into system_settings table
INSERT INTO public.system_settings (category, key, value, created_by, updated_by)
VALUES 
  ('appearance', 'theme_mode', '"light"', null, null),
  ('appearance', 'color_scheme', '"bjj-gold"', null, null)
ON CONFLICT (category, key, branch_id) DO NOTHING;
