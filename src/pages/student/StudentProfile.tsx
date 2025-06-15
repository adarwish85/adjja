
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Award, 
  Camera,
  Save,
  Edit,
  Trophy,
  ExternalLink,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useBJJProfile } from "@/hooks/useBJJProfile";
import { format } from "date-fns";
import { toast } from "sonner";
import { BJJProfileForm } from "@/components/profile/BJJProfileForm";
import { GalleryManager } from "@/components/profile/GalleryManager";
import { CompetitionStatsForm } from "@/components/profile/CompetitionStatsForm";
import { ExternalLinksForm } from "@/components/profile/ExternalLinksForm";
import { PrivacySettingsForm } from "@/components/profile/PrivacySettingsForm";

const StudentProfile = () => {
  const { user, userProfile } = useAuth();
  const { bjjProfile, loading: bjjLoading, saveBJJProfile } = useBJJProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch student details and subscription info
  const { data: studentData, isLoading } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data: student } = await supabase
        .from('students')
        .select(`
          *,
          subscription_plans (
            title,
            subscription_period,
            number_of_classes,
            standard_price
          )
        `)
        .eq('email', user.email)
        .single();

      return student;
    },
    enabled: !!user
  });

  // Fetch full profile with phone and profile picture
  const { data: fullProfile } = useQuery({
    queryKey: ['full-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return data;
    },
    enabled: !!user
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await saveBJJProfile(bjjProfile);
      if (success) {
        setIsEditing(false);
        toast.success("Profile saved successfully!");
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form would happen automatically due to useBJJProfile hook
  };

  if (isLoading || bjjLoading) {
    return (
      <StudentLayout>
        <div className="p-4 lg:p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">BJJ Athlete Profile</h1>
            <p className="text-bjj-gray">Manage your BJJ journey and athlete information</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Overview Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={fullProfile?.profile_picture_url} />
                  <AvatarFallback className="text-2xl">
                    {userProfile?.name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <CardTitle className="text-xl">{userProfile?.name}</CardTitle>
              <CardDescription>{userProfile?.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Belt Rank Display */}
              <div className="text-center p-4 bg-bjj-gold/10 rounded-lg">
                <Award className="h-8 w-8 text-bjj-gold mx-auto mb-2" />
                <div className="text-lg font-bold text-bjj-navy">
                  {bjjProfile.belt_rank || studentData?.belt || 'White'} Belt
                </div>
                <div className="text-sm text-bjj-gray">
                  {studentData?.stripes || 0} Stripes
                </div>
              </div>

              {/* Academy/Team */}
              {bjjProfile.academy_team && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-bjj-navy">Team</div>
                  <div className="text-sm text-bjj-gray">{bjjProfile.academy_team}</div>
                </div>
              )}

              {/* Competition Stats */}
              {(bjjProfile.competitions_count || 0) > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-bjj-navy flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Competition Stats
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-yellow-50 rounded">
                      <div className="font-bold text-yellow-600">{bjjProfile.gold_medals || 0}</div>
                      <div>Gold</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-bold text-gray-600">{bjjProfile.silver_medals || 0}</div>
                      <div>Silver</div>
                    </div>
                    <div className="p-2 bg-amber-50 rounded">
                      <div className="font-bold text-amber-600">{bjjProfile.bronze_medals || 0}</div>
                      <div>Bronze</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Member Since */}
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-bjj-navy">Member Since</div>
                <div className="text-sm text-bjj-gray flex items-center justify-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(studentData?.joined_date || new Date()), 'MMM yyyy')}
                </div>
              </div>

              {/* Social Links */}
              {(bjjProfile.instagram_url || bjjProfile.facebook_url) && (
                <div className="space-y-2">
                  <h4 className="font-medium text-bjj-navy">Social Links</h4>
                  <div className="flex gap-2">
                    {bjjProfile.instagram_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(bjjProfile.instagram_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    {bjjProfile.facebook_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(bjjProfile.facebook_url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Public Profile Status */}
              {bjjProfile.is_public && (
                <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-medium text-green-700">Public Profile</div>
                  <div className="text-xs text-green-600">
                    {bjjProfile.profile_views || 0} views
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {isEditing ? (
              /* Editing Mode - Tabs Interface */
              <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="competition">Competition</TabsTrigger>
                  <TabsTrigger value="links">Social Links</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <BJJProfileForm 
                    data={bjjProfile}
                    onChange={(data) => {
                      Object.assign(bjjProfile, data);
                    }}
                    loading={saving}
                  />
                </TabsContent>

                <TabsContent value="gallery">
                  <GalleryManager
                    images={bjjProfile.gallery_images || []}
                    onChange={(images) => {
                      bjjProfile.gallery_images = images;
                    }}
                    loading={saving}
                  />
                </TabsContent>

                <TabsContent value="competition">
                  <CompetitionStatsForm
                    data={{
                      competitions_count: bjjProfile.competitions_count,
                      gold_medals: bjjProfile.gold_medals,
                      silver_medals: bjjProfile.silver_medals,
                      bronze_medals: bjjProfile.bronze_medals,
                      notable_wins: bjjProfile.notable_wins
                    }}
                    onChange={(data) => {
                      Object.assign(bjjProfile, data);
                    }}
                  />
                </TabsContent>

                <TabsContent value="links">
                  <ExternalLinksForm
                    data={{
                      instagram_url: bjjProfile.instagram_url,
                      facebook_url: bjjProfile.facebook_url,
                      smoothcomp_url: bjjProfile.smoothcomp_url,
                      bjj_heroes_url: bjjProfile.bjj_heroes_url,
                      other_link_1: bjjProfile.other_link_1,
                      other_link_1_name: bjjProfile.other_link_1_name,
                      other_link_2: bjjProfile.other_link_2,
                      other_link_2_name: bjjProfile.other_link_2_name
                    }}
                    onChange={(data) => {
                      Object.assign(bjjProfile, data);
                    }}
                  />
                </TabsContent>

                <TabsContent value="privacy">
                  <PrivacySettingsForm
                    data={{
                      is_public: bjjProfile.is_public,
                      profile_slug: bjjProfile.profile_slug,
                      profile_views: bjjProfile.profile_views
                    }}
                    onChange={(data) => {
                      Object.assign(bjjProfile, data);
                    }}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              /* View Mode - Display Profile Information */
              <div className="space-y-6">
                {/* Basic Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Athlete Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-bjj-gray">Weight</label>
                          <div className="text-bjj-navy">
                            {bjjProfile.weight_kg ? `${bjjProfile.weight_kg} kg` : 'Not specified'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-bjj-gray">Favorite Position</label>
                          <div className="text-bjj-navy">
                            {bjjProfile.favorite_position || 'Not specified'}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-bjj-gray">Height</label>
                          <div className="text-bjj-navy">
                            {bjjProfile.height_cm ? `${bjjProfile.height_cm} cm` : 'Not specified'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-bjj-gray">Favorite Submission</label>
                          <div className="text-bjj-navy">
                            {bjjProfile.favorite_submission || 'Not specified'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {bjjProfile.about_me && (
                      <div>
                        <label className="text-sm font-medium text-bjj-gray">About Me</label>
                        <div className="text-bjj-navy mt-1 whitespace-pre-wrap">
                          {bjjProfile.about_me}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Photo Gallery */}
                {bjjProfile.gallery_images && bjjProfile.gallery_images.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Photo Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {bjjProfile.gallery_images.map((imageUrl, index) => (
                          <div key={imageUrl} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Subscription Information */}
                {studentData?.subscription_plans && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Membership Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-bjj-gray">Plan</label>
                          <div className="text-bjj-navy">
                            {(studentData.subscription_plans as any)?.title}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-bjj-gray">Status</label>
                          <div>
                            <Badge variant={studentData.payment_status === 'paid' ? 'default' : 'destructive'}>
                              {studentData.payment_status?.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;
