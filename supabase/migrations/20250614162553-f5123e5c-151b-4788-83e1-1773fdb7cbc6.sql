
-- Create BJJ profiles table with all the athlete-specific fields
CREATE TABLE public.bjj_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  weight_kg decimal(5,2) CHECK (weight_kg > 0),
  height_cm decimal(5,1) CHECK (height_cm > 0),
  belt_rank text CHECK (belt_rank IN ('White', 'Blue', 'Purple', 'Brown', 'Black')),
  academy_team text,
  favorite_position text,
  favorite_submission text,
  instagram_url text,
  facebook_url text,
  about_me text,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on bjj_profiles table
ALTER TABLE public.bjj_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bjj_profiles
CREATE POLICY "Users can view all bjj profiles" ON public.bjj_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own bjj profile" ON public.bjj_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bjj profile" ON public.bjj_profiles
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bjj profile" ON public.bjj_profiles
FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery', 
  'gallery', 
  true, 
  10485760, -- 10MB limit per image
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies for gallery images
CREATE POLICY "Users can view all gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Users can upload their own gallery images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own gallery images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own gallery images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_bjj_profiles_updated_at
    BEFORE UPDATE ON public.bjj_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
