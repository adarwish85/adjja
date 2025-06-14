
-- Extend BJJ profiles table with new fields for public profiles, competition stats, and external links
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS profile_slug text UNIQUE;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS profile_views integer DEFAULT 0;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS competitions_count integer DEFAULT 0;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS gold_medals integer DEFAULT 0;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS silver_medals integer DEFAULT 0;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS bronze_medals integer DEFAULT 0;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS notable_wins text;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS smoothcomp_url text;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS bjj_heroes_url text;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS other_link_1 text;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS other_link_1_name text;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS other_link_2 text;
ALTER TABLE public.bjj_profiles ADD COLUMN IF NOT EXISTS other_link_2_name text;

-- Create index on profile_slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_bjj_profiles_slug ON public.bjj_profiles(profile_slug);
CREATE INDEX IF NOT EXISTS idx_bjj_profiles_public ON public.bjj_profiles(is_public);

-- Update RLS policies to allow public read access for public profiles
CREATE POLICY "Public can view public bjj profiles" ON public.bjj_profiles
FOR SELECT USING (is_public = true);

-- Function to generate unique profile slug
CREATE OR REPLACE FUNCTION public.generate_profile_slug(p_user_id uuid, p_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
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
$$;

-- Function to auto-generate slug when profile is made public
CREATE OR REPLACE FUNCTION public.auto_generate_profile_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
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
$$;

-- Create trigger for auto-generating profile slug
DROP TRIGGER IF EXISTS trigger_auto_generate_profile_slug ON public.bjj_profiles;
CREATE TRIGGER trigger_auto_generate_profile_slug
  BEFORE UPDATE ON public.bjj_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_profile_slug();
