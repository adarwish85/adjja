
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface GalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  loading?: boolean;
}

export const GalleryManager = ({ images, onChange, loading }: GalleryManagerProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/gallery/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 10) {
      toast.error("Maximum 10 images allowed in gallery");
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(uploadImage);
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];
      
      if (validUrls.length > 0) {
        onChange([...images, ...validUrls]);
        toast.success(`${validUrls.length} image(s) uploaded successfully`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageUrl: string) => {
    try {
      // Extract file path from URL for deletion
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${user?.id}/gallery/${fileName}`;

      await supabase.storage
        .from('gallery')
        .remove([filePath]);

      const updatedImages = images.filter(img => img !== imageUrl);
      onChange(updatedImages);
      toast.success("Image removed successfully");
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error("Failed to remove image");
    }
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const reorderedImages = [...images];
    const [removed] = reorderedImages.splice(fromIndex, 1);
    reorderedImages.splice(toIndex, 0, removed);
    onChange(reorderedImages);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Photo Gallery
        </CardTitle>
        <p className="text-sm text-gray-600">
          Upload up to 10 photos to showcase your BJJ journey
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <label className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                {uploading ? "Uploading..." : "Click to upload images"}
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG, WEBP up to 10MB each
              </span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading || loading || images.length >= 10}
            />
          </label>
        </div>

        {/* Images Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <div key={imageUrl} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeImage(imageUrl)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={loading}
                >
                  <X className="h-3 w-3" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Camera className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No images uploaded yet</p>
            <p className="text-sm">Start building your BJJ photo gallery</p>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          {images.length}/10 images uploaded
        </div>
      </CardContent>
    </Card>
  );
};
