
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BJJProfileData {
  weight_kg?: number;
  height_cm?: number;
  belt_rank?: string;
  academy_team?: string;
  favorite_position?: string;
  favorite_submission?: string;
  instagram_url?: string;
  facebook_url?: string;
  about_me?: string;
}

interface BJJProfileFormProps {
  data: BJJProfileData;
  onChange: (data: BJJProfileData) => void;
  loading?: boolean;
}

const beltRanks = ['White', 'Blue', 'Purple', 'Brown', 'Black'];

const popularPositions = [
  'Guard', 'Mount', 'Back Control', 'Side Control', 'Half Guard',
  'Closed Guard', 'Open Guard', 'Butterfly Guard', 'De La Riva Guard',
  'X-Guard', 'Spider Guard', 'Lasso Guard', 'Knee On Belly'
];

const popularSubmissions = [
  'Rear Naked Choke', 'Triangle Choke', 'Armbar', 'Kimura', 'Americana',
  'Guillotine', 'D\'Arce Choke', 'Anaconda Choke', 'Heel Hook', 'Kneebar',
  'Toe Hold', 'Calf Slicer', 'Omoplata', 'Gogoplata', 'Ezekiel Choke'
];

export const BJJProfileForm = ({ data, onChange, loading }: BJJProfileFormProps) => {
  const handleChange = (field: keyof BJJProfileData, value: string | number) => {
    console.log(`BJJProfileForm updating ${field} to:`, value);
    const updatedData = { ...data, [field]: value };
    onChange(updatedData);
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Physical Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-bjj-navy">Athlete Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="30"
                max="200"
                value={data.weight_kg || ''}
                onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 72.5"
                className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                min="120"
                max="250"
                value={data.height_cm || ''}
                onChange={(e) => handleChange('height_cm', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 175"
                className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="academy">Academy / Team</Label>
              <Input
                id="academy"
                value={data.academy_team || ''}
                onChange={(e) => handleChange('academy_team', e.target.value)}
                placeholder="e.g., Gracie Barra, Alliance, etc."
                className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="belt">BJJ Belt Rank</Label>
              <Select
                value={data.belt_rank || ''}
                onValueChange={(value) => handleChange('belt_rank', value)}
              >
                <SelectTrigger className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg">
                  <SelectValue placeholder="Select your belt rank" />
                </SelectTrigger>
                <SelectContent>
                  {beltRanks.map((belt) => (
                    <SelectItem key={belt} value={belt}>
                      {belt} Belt
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-bjj-navy">Favorite Techniques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Favorite Position</Label>
              <Select
                value={data.favorite_position || ''}
                onValueChange={(value) => handleChange('favorite_position', value)}
              >
                <SelectTrigger className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg">
                  <SelectValue placeholder="Select favorite position" />
                </SelectTrigger>
                <SelectContent>
                  {popularPositions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="submission">Favorite Submission</Label>
              <Select
                value={data.favorite_submission || ''}
                onValueChange={(value) => handleChange('favorite_submission', value)}
              >
                <SelectTrigger className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg">
                  <SelectValue placeholder="Select favorite submission" />
                </SelectTrigger>
                <SelectContent>
                  {popularSubmissions.map((submission) => (
                    <SelectItem key={submission} value={submission}>
                      {submission}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-bjj-navy">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram URL</Label>
              <Input
                id="instagram"
                type="url"
                value={data.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/username"
                className={`border-2 rounded-lg ${!validateUrl(data.instagram_url || '') ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'}`}
              />
              {data.instagram_url && !validateUrl(data.instagram_url) && (
                <p className="text-xs text-red-500">Please enter a valid URL</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook URL</Label>
              <Input
                id="facebook"
                type="url"
                value={data.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                placeholder="https://facebook.com/username"
                className={`border-2 rounded-lg ${!validateUrl(data.facebook_url || '') ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'}`}
              />
              {data.facebook_url && !validateUrl(data.facebook_url) && (
                <p className="text-xs text-red-500">Please enter a valid URL</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Me */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-bjj-navy">About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="about">Tell us about your BJJ journey</Label>
            <Textarea
              id="about"
              rows={4}
              value={data.about_me || ''}
              onChange={(e) => handleChange('about_me', e.target.value)}
              placeholder="Tell us about your BJJ journey, achievements, goals, etc..."
              maxLength={1000}
              className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg resize-none"
            />
            <p className="text-xs text-gray-500">
              {(data.about_me || '').length}/1000 characters
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
