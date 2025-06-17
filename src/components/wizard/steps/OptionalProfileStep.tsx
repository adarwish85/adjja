
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Image as ImageIcon, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OptionalProfileStepProps {
  data: {
    weight_kg?: number;
    height_cm?: number;
    favorite_position?: string;
    favorite_submission?: string;
    instagram_url?: string;
    facebook_url?: string;
    cover_photo_url?: string;
    gallery_images?: string[];
  };
  updateData: (data: Partial<any>) => void;
}

export const OptionalProfileStep = ({ data, updateData }: OptionalProfileStepProps) => {
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      // Placeholder for cover photo upload
      const fakeUrl = `https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&h=300&fit=crop`;
      updateData({ cover_photo_url: fakeUrl });
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploadingCover(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          These fields are optional and can be completed later. You can skip this step 
          and submit your profile for approval, then return to complete these details anytime.
        </AlertDescription>
      </Alert>

      {/* Cover Photo */}
      <div>
        <Label className="text-sm font-medium">Cover Photo</Label>
        <div className="mt-2">
          {data.cover_photo_url ? (
            <div className="relative">
              <img 
                src={data.cover_photo_url} 
                alt="Cover" 
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-2 right-2"
                onClick={() => updateData({ cover_photo_url: '' })}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <Label htmlFor="cover-upload" className="cursor-pointer">
                <Button variant="outline" disabled={uploadingCover}>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingCover ? "Uploading..." : "Upload Cover Photo"}
                </Button>
              </Label>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>

      {/* Physical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="0"
            value={data.weight_kg || ''}
            onChange={(e) => updateData({ weight_kg: parseFloat(e.target.value) || undefined })}
            placeholder="Enter your weight"
          />
        </div>

        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            min="0"
            value={data.height_cm || ''}
            onChange={(e) => updateData({ height_cm: parseFloat(e.target.value) || undefined })}
            placeholder="Enter your height"
          />
        </div>
      </div>

      {/* BJJ Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="favorite_position">Favorite Position</Label>
          <Input
            id="favorite_position"
            value={data.favorite_position || ''}
            onChange={(e) => updateData({ favorite_position: e.target.value })}
            placeholder="e.g., Guard, Mount, Side Control"
          />
        </div>

        <div>
          <Label htmlFor="favorite_submission">Favorite Submission</Label>
          <Input
            id="favorite_submission"
            value={data.favorite_submission || ''}
            onChange={(e) => updateData({ favorite_submission: e.target.value })}
            placeholder="e.g., Rear Naked Choke, Armbar"
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="instagram">Instagram URL</Label>
          <Input
            id="instagram"
            type="url"
            value={data.instagram_url || ''}
            onChange={(e) => updateData({ instagram_url: e.target.value })}
            placeholder="https://instagram.com/yourusername"
          />
        </div>

        <div>
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input
            id="facebook"
            type="url"
            value={data.facebook_url || ''}
            onChange={(e) => updateData({ facebook_url: e.target.value })}
            placeholder="https://facebook.com/yourusername"
          />
        </div>
      </div>
    </div>
  );
};
