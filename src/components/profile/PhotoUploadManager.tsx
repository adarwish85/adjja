
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PhotoUploadManagerProps {
  onFormChange: (changes: any) => void;
  setLoading: (loading: boolean) => void;
}

export const PhotoUploadManager = ({ onFormChange, setLoading }: PhotoUploadManagerProps) => {
  const { user } = useAuth();

  const handleCoverPhotoEdit = async () => {
    try {
      console.log('📸 Starting cover photo upload...');
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) {
          console.log('❌ No file selected');
          return;
        }
        
        console.log('📁 File selected:', file.name, file.size, 'bytes');
        setLoading(true);

        try {
          // Upload to Supabase Storage (bucket: profiles)
          const fileName = `${user.id}/cover/${Date.now()}_${file.name}`;
          console.log('📤 Uploading to:', fileName);
          
          const { error } = await supabase
            .storage
            .from('profiles')
            .upload(fileName, file, { upsert: true });

          if (error) {
            console.error('❌ Cover photo upload error:', error);
            throw error;
          }

          console.log('✅ Upload successful, getting public URL...');
          const { data } = supabase.storage.from('profiles').getPublicUrl(fileName);
          
          console.log('🔗 Public URL:', data.publicUrl);
          onFormChange({ cover_photo_url: data.publicUrl });
          toast.success("Cover photo updated!");
        } catch (uploadError) {
          console.error('💥 Upload process error:', uploadError);
          toast.error("Failed to upload cover photo");
        } finally {
          setLoading(false);
        }
      };
      input.click();
    } catch (error) {
      console.error('💥 Cover photo selection error:', error);
      toast.error("Failed to select image");
      setLoading(false);
    }
  };

  const handleAvatarEdit = async () => {
    try {
      console.log('🖼️ Starting avatar upload...');
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) {
          console.log('❌ No file selected');
          return;
        }
        
        console.log('📁 File selected:', file.name, file.size, 'bytes');
        setLoading(true);

        try {
          // Upload to Supabase Storage (bucket: profiles)
          const fileName = `${user.id}/profile/${Date.now()}_${file.name}`;
          console.log('📤 Uploading to:', fileName);
          
          const { error } = await supabase
            .storage
            .from('profiles')
            .upload(fileName, file, { upsert: true });

          if (error) {
            console.error('❌ Profile photo upload error:', error);
            throw error;
          }

          console.log('✅ Upload successful, getting public URL...');
          const { data } = supabase.storage.from('profiles').getPublicUrl(fileName);
          
          console.log('🔗 Public URL:', data.publicUrl);
          onFormChange({ profile_picture_url: data.publicUrl });
          toast.success("Profile photo updated!");
        } catch (uploadError) {
          console.error('💥 Upload process error:', uploadError);
          toast.error("Failed to upload photo");
        } finally {
          setLoading(false);
        }
      };
      input.click();
    } catch (error) {
      console.error('💥 Profile photo selection error:', error);
      toast.error("Failed to select image");
      setLoading(false);
    }
  };

  return {
    handleCoverPhotoEdit,
    handleAvatarEdit
  };
};
