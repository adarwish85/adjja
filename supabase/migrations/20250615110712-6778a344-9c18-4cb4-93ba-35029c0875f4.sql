
-- Create coach_profiles table for enhanced coach information
CREATE TABLE public.coach_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bio text,
  rank text,
  certifications text[],
  years_experience integer DEFAULT 0,
  social_media jsonb DEFAULT '{}',
  featured_media jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create coach_notes table for session notes
CREATE TABLE public.coach_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  note_content text NOT NULL,
  session_date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create progress_videos table for student progress tracking
CREATE TABLE public.progress_videos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  video_url text NOT NULL,
  description text,
  duration_seconds integer DEFAULT 0,
  upload_date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create coach_feed_posts table for coach communication
CREATE TABLE public.coach_feed_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_type text NOT NULL DEFAULT 'announcement',
  title text NOT NULL,
  content text NOT NULL,
  target_classes uuid[] DEFAULT '{}',
  target_students uuid[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add coach relationship to students table if not exists
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS coach_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Enable RLS on new tables
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_feed_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for coach_profiles
CREATE POLICY "Coaches can view all coach profiles" ON public.coach_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own coach profile" ON public.coach_profiles
FOR ALL USING (auth.uid() = user_id);

-- RLS policies for coach_notes
CREATE POLICY "Coaches can view their own notes" ON public.coach_notes
FOR SELECT USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can manage their own notes" ON public.coach_notes
FOR ALL USING (auth.uid() = coach_id);

-- RLS policies for progress_videos
CREATE POLICY "Coaches and students can view relevant videos" ON public.progress_videos
FOR SELECT USING (
  auth.uid() = coach_id OR 
  auth.uid() IN (SELECT auth.users.id FROM auth.users JOIN public.students ON auth.users.email = public.students.email WHERE public.students.id = student_id)
);

CREATE POLICY "Coaches can manage their uploaded videos" ON public.progress_videos
FOR ALL USING (auth.uid() = coach_id);

-- RLS policies for coach_feed_posts
CREATE POLICY "Everyone can view public posts" ON public.coach_feed_posts
FOR SELECT USING (is_public = true);

CREATE POLICY "Coaches can view all posts" ON public.coach_feed_posts
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.profiles p ON ur.id = p.role_id WHERE p.id = auth.uid() AND ur.name IN ('Coach', 'Super Admin'))
);

CREATE POLICY "Coaches can manage their own posts" ON public.coach_feed_posts
FOR ALL USING (auth.uid() = coach_id);

-- Update handle_new_user function to assign Student role by default
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  student_role_id UUID;
BEGIN
  -- Get the Student role ID
  SELECT id INTO student_role_id FROM public.user_roles WHERE name = 'Student' LIMIT 1;
  
  -- Insert into profiles table with Student role
  INSERT INTO public.profiles (id, name, email, role_id, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    new.email,
    student_role_id,
    'active'
  );
  
  -- Log the registration activity
  INSERT INTO public.user_activity_logs (user_id, user_name, action, category, details, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    'User Registration',
    'Authentication',
    'New user account created with Student role',
    'success'
  );
  
  RETURN new;
END;
$$;

-- Create function to upgrade user to coach
CREATE OR REPLACE FUNCTION public.upgrade_user_to_coach(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  coach_role_id UUID;
  current_user_role TEXT;
BEGIN
  -- Check if current user is Super Admin
  SELECT ur.name INTO current_user_role
  FROM public.profiles p
  JOIN public.user_roles ur ON p.role_id = ur.id
  WHERE p.id = auth.uid();
  
  IF current_user_role != 'Super Admin' THEN
    RAISE EXCEPTION 'Only Super Admin can upgrade users to Coach';
  END IF;
  
  -- Get the Coach role ID
  SELECT id INTO coach_role_id FROM public.user_roles WHERE name = 'Coach' LIMIT 1;
  
  -- Update user role to Coach
  UPDATE public.profiles 
  SET role_id = coach_role_id, updated_at = now()
  WHERE id = p_user_id;
  
  -- Create coach profile entry
  INSERT INTO public.coach_profiles (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN FOUND;
END;
$$;

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_coach_profiles_updated_at BEFORE UPDATE ON public.coach_profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coach_notes_updated_at BEFORE UPDATE ON public.coach_notes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progress_videos_updated_at BEFORE UPDATE ON public.progress_videos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coach_feed_posts_updated_at BEFORE UPDATE ON public.coach_feed_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
