
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
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

        // Upload to Supabase Storage (bucket: profiles)
        const fileName = `${user.id}/cover/${Date.now()}_${file.name}`;
        const { error } = await supabase
          .storage
          .from('profiles')
          .upload(fileName, file, { upsert: true });

        if (error) {
          console.error('Cover photo upload error:', error);
          toast.error("Failed to upload cover photo");
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from('profiles').getPublicUrl(fileName);
        onFormChange({ cover_photo_url: data.publicUrl });
        toast.success("Cover photo updated!");
        setLoading(false);
      };
      input.click();
    } catch (error) {
      console.error('Cover photo selection error:', error);
      toast.error("Failed to select image");
      setLoading(false);
    }
  };

  const handleAvatarEdit = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);

        // Upload to Supabase Storage (bucket: profiles)
        const fileName = `${user.id}/profile/${Date.now()}_${file.name}`;
        const { error } = await supabase
          .storage
          .from('profiles')
          .upload(fileName, file, { upsert: true });

        if (error) {
          console.error('Profile photo upload error:', error);
          toast.error("Failed to upload photo");
          setLoading(false);
          return;
        }

        const { data } = supabase.storage.from('profiles').getPublicUrl(fileName);
        onFormChange({ profile_picture_url: data.publicUrl });
        toast.success("Profile photo updated!");
        setLoading(false);
      };
      input.click();
    } catch (error) {
      console.error('Profile photo selection error:', error);
      toast.error("Failed to select image");
      setLoading(false);
    }
  };

  return {
    handleCoverPhotoEdit,
    handleAvatarEdit
  };
};
