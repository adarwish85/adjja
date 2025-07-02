
-- Update the academy name in system settings
UPDATE public.system_settings 
SET value = '"Ahmed Darwish Jiu-Jitsu Academy"'
WHERE category = 'general' AND key = 'academy_name';

-- Insert the setting if it doesn't exist
INSERT INTO public.system_settings (category, key, value)
SELECT 'general', 'academy_name', '"Ahmed Darwish Jiu-Jitsu Academy"'
WHERE NOT EXISTS (
    SELECT 1 FROM public.system_settings 
    WHERE category = 'general' AND key = 'academy_name'
);
