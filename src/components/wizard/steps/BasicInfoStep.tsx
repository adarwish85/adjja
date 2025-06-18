
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";

interface BasicInfoStepProps {
  data: {
    name: string;
    phone: string;
    profile_picture_url: string;
  };
  updateData: (data: Partial<any>) => void;
}

export const BasicInfoStep = ({ data, updateData }: BasicInfoStepProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Create a temporary URL for preview
      const fileUrl = URL.createObjectURL(file);
      updateData({ profile_picture_url: fileUrl });
      
      // In a real implementation, you'd upload to Supabase Storage here
      // For now, we'll use a placeholder that simulates an uploaded file
      setTimeout(() => {
        const fakeUrl = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`;
        updateData({ profile_picture_url: fakeUrl });
        setUploading(false);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('profile-upload');
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Please provide your basic information. All fields marked with * are required.
        </p>
      </div>

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={data.profile_picture_url} />
          <AvatarFallback>
            <User className="w-12 h-12 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        
        <div>
          <Button 
            type="button"
            variant="outline" 
            className="bg-white" 
            disabled={uploading}
            onClick={triggerFileInput}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Profile Picture *"}
          </Button>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500 text-center">
          Recommended: Square image, at least 200x200 pixels
        </p>
      </div>

      {/* Basic Info Fields */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="Enter your phone number"
            required
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Privacy Note:</strong> Your profile information will be reviewed by our admin team 
          before you gain full access to the platform. This helps us maintain a safe and 
          authentic community.
        </p>
      </div>
    </div>
  );
};
