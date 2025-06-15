
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Weight, Ruler, Trophy, Target, Users, Link } from "lucide-react";

interface BJJProfileData {
  weight_kg?: number;
  height_cm?: number;
  belt_rank?: string;
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
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Weight className="h-4 w-4 text-bjj-gold" />
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            min="30"
            max="200"
            value={data.weight_kg || ''}
            onChange={(e) => handleChange('weight_kg', parseFloat(e.target.value) || 0)}
            placeholder="e.g., 72.5"
            className="h-12 border-2 border-gray-200 focus:border-bjj-gold rounded-xl"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-bjj-gold" />
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            min="120"
            max="250"
            value={data.height_cm || ''}
            onChange={(e) => handleChange('height_cm', parseFloat(e.target.value) || 0)}
            placeholder="e.g., 175"
            className="h-12 border-2 border-gray-200 focus:border-bjj-gold rounded-xl"
          />
        </div>
      </div>

      {/* BJJ Rank */}
      <div className="space-y-2">
        <Label htmlFor="belt" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-bjj-gold" />
          BJJ Belt Rank
        </Label>
        <Select
          value={data.belt_rank || ''}
          onValueChange={(value) => handleChange('belt_rank', value)}
        >
          <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-bjj-gold rounded-xl">
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

      {/* Favorite Techniques */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="position" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Target className="h-4 w-4 text-bjj-gold" />
            Favorite Position
          </Label>
          <Select
            value={data.favorite_position || ''}
            onValueChange={(value) => handleChange('favorite_position', value)}
          >
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-bjj-gold rounded-xl">
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
          <Label htmlFor="submission" className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Target className="h-4 w-4 text-bjj-gold" />
            Favorite Submission
          </Label>
          <Select
            value={data.favorite_submission || ''}
            onValueChange={(value) => handleChange('favorite_submission', value)}
          >
            <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-bjj-gold rounded-xl">
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

      {/* Social Links */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Link className="h-4 w-4 text-bjj-gold" />
          Social Links
        </Label>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-xs text-gray-600">Instagram URL</Label>
            <Input
              id="instagram"
              type="url"
              value={data.instagram_url || ''}
              onChange={(e) => handleChange('instagram_url', e.target.value)}
              placeholder="https://instagram.com/username"
              className={`h-12 border-2 rounded-xl ${!validateUrl(data.instagram_url || '') ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'}`}
            />
            {data.instagram_url && !validateUrl(data.instagram_url) && (
              <p className="text-xs text-red-500">Please enter a valid URL</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="facebook" className="text-xs text-gray-600">Facebook URL</Label>
            <Input
              id="facebook"
              type="url"
              value={data.facebook_url || ''}
              onChange={(e) => handleChange('facebook_url', e.target.value)}
              placeholder="https://facebook.com/username"
              className={`h-12 border-2 rounded-xl ${!validateUrl(data.facebook_url || '') ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'}`}
            />
            {data.facebook_url && !validateUrl(data.facebook_url) && (
              <p className="text-xs text-red-500">Please enter a valid URL</p>
            )}
          </div>
        </div>
      </div>

      {/* About Me */}
      <div className="space-y-2">
        <Label htmlFor="about" className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Users className="h-4 w-4 text-bjj-gold" />
          About Me
        </Label>
        <Textarea
          id="about"
          rows={4}
          value={data.about_me || ''}
          onChange={(e) => handleChange('about_me', e.target.value)}
          placeholder="Tell us about your BJJ journey, achievements, goals, etc..."
          maxLength={1000}
          className="border-2 border-gray-200 focus:border-bjj-gold rounded-xl resize-none"
        />
        <p className="text-xs text-gray-500">
          {(data.about_me || '').length}/1000 characters
        </p>
      </div>
    </div>
  );
};
