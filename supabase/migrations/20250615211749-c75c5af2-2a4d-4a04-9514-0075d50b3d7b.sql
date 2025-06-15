
-- Add the missing assigned_classes column to the coach_profiles table
ALTER TABLE public.coach_profiles ADD COLUMN IF NOT EXISTS assigned_classes text[] DEFAULT '{}';

-- Add specialties column if it doesn't exist (for completeness)
ALTER TABLE public.coach_profiles ADD COLUMN IF NOT EXISTS specialties text[] DEFAULT '{}';
