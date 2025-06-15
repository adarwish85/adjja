
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Globe } from "lucide-react";

interface ExternalLinksData {
  instagram_url?: string;
  facebook_url?: string;
  smoothcomp_url?: string;
  bjj_heroes_url?: string;
  other_link_1?: string;
  other_link_1_name?: string;
  other_link_2?: string;
  other_link_2_name?: string;
}

interface ExternalLinksFormProps {
  data: ExternalLinksData;
  onChange: (data: ExternalLinksData) => void;
}

export const ExternalLinksForm = ({ data, onChange }: ExternalLinksFormProps) => {
  const handleChange = (field: keyof ExternalLinksData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true; // Empty URLs are valid (optional fields)
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-bjj-gold" />
          Social & External Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instagram */}
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram Profile</Label>
          <Input
            id="instagram"
            type="url"
            value={data.instagram_url || ''}
            onChange={(e) => handleChange('instagram_url', e.target.value)}
            placeholder="https://instagram.com/your_profile"
            className={!validateUrl(data.instagram_url || '') ? 'border-red-500' : ''}
          />
          {data.instagram_url && !validateUrl(data.instagram_url) && (
            <p className="text-xs text-red-500">Please enter a valid URL</p>
          )}
        </div>

        {/* Facebook */}
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook Profile</Label>
          <Input
            id="facebook"
            type="url"
            value={data.facebook_url || ''}
            onChange={(e) => handleChange('facebook_url', e.target.value)}
            placeholder="https://facebook.com/your_profile"
            className={!validateUrl(data.facebook_url || '') ? 'border-red-500' : ''}
          />
          {data.facebook_url && !validateUrl(data.facebook_url) && (
            <p className="text-xs text-red-500">Please enter a valid URL</p>
          )}
        </div>

        {/* Smoothcomp */}
        <div className="space-y-2">
          <Label htmlFor="smoothcomp">Smoothcomp Profile</Label>
          <Input
            id="smoothcomp"
            type="url"
            value={data.smoothcomp_url || ''}
            onChange={(e) => handleChange('smoothcomp_url', e.target.value)}
            placeholder="https://smoothcomp.com/en/profile/..."
            className={!validateUrl(data.smoothcomp_url || '') ? 'border-red-500' : ''}
          />
          {data.smoothcomp_url && !validateUrl(data.smoothcomp_url) && (
            <p className="text-xs text-red-500">Please enter a valid URL</p>
          )}
        </div>

        {/* BJJ Heroes */}
        <div className="space-y-2">
          <Label htmlFor="bjj-heroes">BJJ Heroes Profile</Label>
          <Input
            id="bjj-heroes"
            type="url"
            value={data.bjj_heroes_url || ''}
            onChange={(e) => handleChange('bjj_heroes_url', e.target.value)}
            placeholder="https://www.bjjheroes.com/bjj-fighters/..."
            className={!validateUrl(data.bjj_heroes_url || '') ? 'border-red-500' : ''}
          />
          {data.bjj_heroes_url && !validateUrl(data.bjj_heroes_url) && (
            <p className="text-xs text-red-500">Please enter a valid URL</p>
          )}
        </div>

        {/* Custom Links */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Custom Links
          </h4>
          
          {/* Other Link 1 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="other-link-1-name">Link 1 Name</Label>
              <Input
                id="other-link-1-name"
                value={data.other_link_1_name || ''}
                onChange={(e) => handleChange('other_link_1_name', e.target.value)}
                placeholder="e.g., Team Website"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="other-link-1">Link 1 URL</Label>
              <Input
                id="other-link-1"
                type="url"
                value={data.other_link_1 || ''}
                onChange={(e) => handleChange('other_link_1', e.target.value)}
                placeholder="https://..."
                className={!validateUrl(data.other_link_1 || '') ? 'border-red-500' : ''}
              />
              {data.other_link_1 && !validateUrl(data.other_link_1) && (
                <p className="text-xs text-red-500">Please enter a valid URL</p>
              )}
            </div>
          </div>

          {/* Other Link 2 */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="other-link-2-name">Link 2 Name</Label>
              <Input
                id="other-link-2-name"
                value={data.other_link_2_name || ''}
                onChange={(e) => handleChange('other_link_2_name', e.target.value)}
                placeholder="e.g., Personal Website"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="other-link-2">Link 2 URL</Label>
              <Input
                id="other-link-2"
                type="url"
                value={data.other_link_2 || ''}
                onChange={(e) => handleChange('other_link_2', e.target.value)}
                placeholder="https://..."
                className={!validateUrl(data.other_link_2 || '') ? 'border-red-500' : ''}
              />
              {data.other_link_2 && !validateUrl(data.other_link_2) && (
                <p className="text-xs text-red-500">Please enter a valid URL</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
