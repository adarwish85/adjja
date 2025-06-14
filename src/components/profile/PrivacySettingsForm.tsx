
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface PrivacySettingsData {
  is_public?: boolean;
  profile_slug?: string;
  profile_views?: number;
}

interface PrivacySettingsFormProps {
  data: PrivacySettingsData;
  onChange: (data: PrivacySettingsData) => void;
  onPreview?: () => void;
}

export const PrivacySettingsForm = ({ data, onChange, onPreview }: PrivacySettingsFormProps) => {
  const [customSlug, setCustomSlug] = useState(data.profile_slug || '');

  const handlePublicToggle = (isPublic: boolean) => {
    onChange({ ...data, is_public: isPublic });
  };

  const handleSlugChange = (slug: string) => {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setCustomSlug(cleanSlug);
    onChange({ ...data, profile_slug: cleanSlug });
  };

  const copyProfileUrl = () => {
    if (data.profile_slug) {
      const url = `${window.location.origin}/athlete/${data.profile_slug}`;
      navigator.clipboard.writeText(url);
      toast.success("Profile URL copied to clipboard!");
    }
  };

  const openPublicProfile = () => {
    if (data.profile_slug) {
      window.open(`/athlete/${data.profile_slug}`, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {data.is_public ? <Eye className="h-5 w-5 text-green-600" /> : <EyeOff className="h-5 w-5 text-gray-400" />}
          Privacy Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Public Profile Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="public-toggle">Make my profile public</Label>
            <p className="text-sm text-gray-600">
              Allow anyone to view your BJJ athlete profile
            </p>
          </div>
          <Switch
            id="public-toggle"
            checked={data.is_public || false}
            onCheckedChange={handlePublicToggle}
          />
        </div>

        {/* Profile URL Section */}
        {data.is_public && (
          <div className="space-y-4 border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="profile-slug">Profile URL</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /athlete/
                    </span>
                    <Input
                      id="profile-slug"
                      value={customSlug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="your-name"
                      className="rounded-l-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Only letters, numbers, and hyphens allowed
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            {data.profile_slug && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={copyProfileUrl}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy URL
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onPreview || openPublicProfile}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview
                </Button>
              </div>
            )}

            {/* Profile Stats */}
            {data.profile_views !== undefined && (
              <div className="text-sm text-gray-600">
                Profile views: {data.profile_views || 0}
              </div>
            )}
          </div>
        )}

        {/* Privacy Notice */}
        {!data.is_public && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Your profile is currently private. Enable public visibility to share your BJJ journey with the community.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
