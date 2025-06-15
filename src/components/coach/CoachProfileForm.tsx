
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, X, User, Award, Calendar, Loader2 } from "lucide-react";
import { useCoachProfile } from "@/hooks/useCoachProfile";

export const CoachProfileForm = () => {
  const { coachProfile, loading, saveCoachProfile } = useCoachProfile();
  const [formData, setFormData] = useState({
    bio: "",
    rank: "",
    years_experience: 0,
    certifications: [] as string[],
    social_media: {}
  });
  const [newCertification, setNewCertification] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync form data with loaded coach profile
  useEffect(() => {
    if (coachProfile) {
      console.log("Syncing form data with coach profile:", coachProfile);
      setFormData({
        bio: coachProfile.bio || "",
        rank: coachProfile.rank || "",
        years_experience: coachProfile.years_experience || 0,
        certifications: coachProfile.certifications || [],
        social_media: coachProfile.social_media || {}
      });
    }
  }, [coachProfile]);

  const handleSave = async () => {
    console.log("Attempting to save coach profile with data:", formData);
    setIsSaving(true);
    try {
      const success = await saveCoachProfile(formData);
      if (!success) {
        console.error("Save operation returned false");
      }
    } catch (error) {
      console.error("Error saving coach profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading coach profile...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Coach Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell students about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rank">Current Rank</Label>
            <Input
              id="rank"
              placeholder="e.g., Black Belt"
              value={formData.rank}
              onChange={(e) => setFormData(prev => ({ ...prev, rank: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="years">Years of Experience</Label>
            <Input
              id="years"
              type="number"
              min="0"
              value={formData.years_experience}
              onChange={(e) => setFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Certifications</Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="Add certification..."
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCertification()}
            />
            <Button onClick={addCertification} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.certifications.map((cert, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                {cert}
                <button
                  onClick={() => removeCertification(index)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={loading || isSaving} 
          className="w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Coach Profile"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
