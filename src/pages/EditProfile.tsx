
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useBJJProfile } from "@/hooks/useBJJProfile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Camera, ArrowLeft, Dumbbell, Users, Trophy, ExternalLink, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BJJProfileForm } from "@/components/profile/BJJProfileForm";
import { GalleryManager } from "@/components/profile/GalleryManager";
import { CompetitionStatsForm } from "@/components/profile/CompetitionStatsForm";
import { ExternalLinksForm } from "@/components/profile/ExternalLinksForm";
import { PrivacySettingsForm } from "@/components/profile/PrivacySettingsForm";

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { bjjProfile, setBjjProfile, loading: bjjLoading, saveBJJProfile } = useBJJProfile();
  
  const [loading, setLoading] = useState(false);
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const [uploadingCoverPhoto, setUploadingCoverPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profile_picture_url: "",
    cover_photo_url: ""
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData({
          name: profile.name || user.user_metadata?.name || "",
          email: profile.email || user.email || "",
          phone: profile.phone || user.user_metadata?.phone || "",
          profile_picture_url: profile.profile_picture_url || "",
          cover_photo_url: profile.cover_photo_url || ""
        });
      } else {
        setFormData({
          name: user.user_metadata?.name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
          profile_picture_url: "",
          cover_photo_url: ""
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const uploadImage = async (file: File, folder: 'profile-pictures' | 'cover-photos') => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('profiles')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingProfilePic(true);
    try {
      const url = await uploadImage(file, 'profile-pictures');
      if (url) {
        setFormData(prev => ({ ...prev, profile_picture_url: url }));
        toast.success("Profile picture uploaded successfully");
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error("Failed to upload profile picture");
    } finally {
      setUploadingProfilePic(false);
    }
  };

  const handleCoverPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCoverPhoto(true);
    try {
      const url = await uploadImage(file, 'cover-photos');
      if (url) {
        setFormData(prev => ({ ...prev, cover_photo_url: url }));
        toast.success("Cover photo uploaded successfully");
      }
    } catch (error) {
      console.error('Error uploading cover photo:', error);
      toast.error("Failed to upload cover photo");
    } finally {
      setUploadingCoverPhoto(false);
    }
  };

  const handleSubmitPersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({
        email: formData.email,
        data: {
          name: formData.name,
          phone: formData.phone
        }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          profile_picture_url: formData.profile_picture_url,
          cover_photo_url: formData.cover_photo_url
        }, {
          onConflict: 'id'
        });

      if (profileError) {
        throw profileError;
      }

      toast.success("Personal information updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBJJ = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await saveBJJProfile(bjjProfile);
    if (success) {
      toast.success("BJJ profile updated successfully");
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      // Save personal info
      await handleSubmitPersonal(new Event('submit') as any);
      // Save BJJ info
      await handleSubmitBJJ(new Event('submit') as any);
      
      toast.success("All profile information saved successfully");
      navigate(-1);
    } catch (error) {
      console.error('Error saving all profile data:', error);
      toast.error("Failed to save all profile information");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewProfile = () => {
    if (bjjProfile.profile_slug) {
      window.open(`/athlete/${bjjProfile.profile_slug}`, '_blank');
    }
  };

  if (!user) {
    return <div>Please log in to edit your profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-bjj-navy">Edit Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Cover Photo Section */}
        <Card className="mb-6">
          <div className="relative">
            <div 
              className="h-48 bg-gradient-to-r from-bjj-navy to-bjj-gold rounded-t-lg bg-cover bg-center"
              style={{
                backgroundImage: formData.cover_photo_url ? `url(${formData.cover_photo_url})` : undefined
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-t-lg flex items-center justify-center">
                <label className="cursor-pointer">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4 text-white hover:bg-opacity-30 transition-all">
                    <div className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      <span>{uploadingCoverPhoto ? "Uploading..." : "Change Cover Photo"}</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverPhotoUpload}
                    disabled={uploadingCoverPhoto}
                  />
                </label>
              </div>
            </div>
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={formData.profile_picture_url} />
                  <AvatarFallback className="bg-bjj-gold text-white text-2xl">
                    {formData.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-2 right-2 cursor-pointer">
                  <div className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all">
                    <Camera className="h-4 w-4 text-bjj-navy" />
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    disabled={uploadingProfilePic}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="pt-20 p-6">
            <h2 className="text-xl font-semibold text-bjj-navy">Profile Photos</h2>
            <p className="text-gray-600">Update your profile picture and cover photo</p>
          </div>
        </Card>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="bjj" className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              BJJ Details
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Competition
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPersonal} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email address"
                        required
                      />
                      <p className="text-xs text-gray-500">You may need to verify your new email address</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-6">
                    <Button 
                      type="submit" 
                      disabled={loading || uploadingProfilePic || uploadingCoverPhoto}
                      className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
                    >
                      {loading ? "Saving..." : "Save Personal Info"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bjj" className="mt-6">
            <div className="space-y-6">
              <BJJProfileForm
                data={bjjProfile}
                onChange={setBjjProfile}
                loading={bjjLoading}
              />
              
              <PrivacySettingsForm
                data={{
                  is_public: bjjProfile.is_public,
                  profile_slug: bjjProfile.profile_slug,
                  profile_views: bjjProfile.profile_views
                }}
                onChange={(privacyData) => setBjjProfile(prev => ({ ...prev, ...privacyData }))}
                onPreview={handlePreviewProfile}
              />
            </div>
          </TabsContent>

          <TabsContent value="competition" className="mt-6">
            <CompetitionStatsForm
              data={{
                competitions_count: bjjProfile.competitions_count,
                gold_medals: bjjProfile.gold_medals,
                silver_medals: bjjProfile.silver_medals,
                bronze_medals: bjjProfile.bronze_medals,
                notable_wins: bjjProfile.notable_wins
              }}
              onChange={(competitionData) => setBjjProfile(prev => ({ ...prev, ...competitionData }))}
            />
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <ExternalLinksForm
              data={{
                smoothcomp_url: bjjProfile.smoothcomp_url,
                bjj_heroes_url: bjjProfile.bjj_heroes_url,
                other_link_1: bjjProfile.other_link_1,
                other_link_1_name: bjjProfile.other_link_1_name,
                other_link_2: bjjProfile.other_link_2,
                other_link_2_name: bjjProfile.other_link_2_name
              }}
              onChange={(linksData) => setBjjProfile(prev => ({ ...prev, ...linksData }))}
            />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <GalleryManager
              images={bjjProfile.gallery_images || []}
              onChange={(images) => setBjjProfile(prev => ({ ...prev, gallery_images: images }))}
              loading={bjjLoading}
            />
          </TabsContent>
        </Tabs>

        {/* Save All Button */}
        <div className="flex justify-end gap-4 pt-8 border-t">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveAll}
            disabled={loading || uploadingProfilePic || uploadingCoverPhoto || bjjLoading}
            className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
          >
            {loading ? "Saving All..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
