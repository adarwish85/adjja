
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Award, 
  CreditCard, 
  Edit, 
  Camera,
  Instagram,
  Facebook,
  Trophy,
  Target
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

const StudentProfile = () => {
  const { user, userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    weight: '',
    height: '',
    favoritePosition: '',
    favoriteSubmission: '',
    about: '',
    instagram: '',
    facebook: ''
  });

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

  // Fetch BJJ profile if exists
  const { data: bjjProfile } = useQuery({
    queryKey: ['bjj-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data } = await supabase
        .from('bjj_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return data;
    },
    enabled: !!user
  });

  const handleSave = async () => {
    // Implementation for saving profile changes
    setIsEditing(false);
  };

  return (
    <StudentLayout>
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">My Profile</h1>
            <p className="text-bjj-gray">Manage your personal information and BJJ journey</p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={userProfile?.profile_picture_url} />
                    <AvatarFallback className="text-2xl">
                      {userProfile?.name?.charAt(0) || 'S'}
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
                {/* Belt Rank */}
                <div className="text-center p-4 bg-bjj-gold/10 rounded-lg">
                  <Award className="h-8 w-8 text-bjj-gold mx-auto mb-2" />
                  <div className="text-lg font-bold text-bjj-navy">
                    {studentData?.belt || 'White'} Belt
                  </div>
                  <div className="text-sm text-bjj-gray">
                    {studentData?.stripes || 0} Stripes
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-bjj-navy">
                      {studentData?.attendance_rate || 0}%
                    </div>
                    <div className="text-xs text-bjj-gray">Attendance</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-bjj-navy">
                      {format(new Date(studentData?.joined_date || new Date()), 'MMM yyyy')}
                    </div>
                    <div className="text-xs text-bjj-gray">Member Since</div>
                  </div>
                </div>

                {/* Social Links */}
                {(bjjProfile?.instagram_url || bjjProfile?.facebook_url) && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-bjj-navy">Social Links</h4>
                    <div className="flex gap-2">
                      {bjjProfile?.instagram_url && (
                        <Button variant="outline" size="sm">
                          <Instagram className="h-4 w-4" />
                        </Button>
                      )}
                      {bjjProfile?.facebook_url && (
                        <Button variant="outline" size="sm">
                          <Facebook className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Main Profile Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      {isEditing ? (
                        <Input
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{userProfile?.name}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <div className="p-2 bg-gray-50 rounded text-bjj-gray">{userProfile?.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      {isEditing ? (
                        <Input
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{userProfile?.phone || 'Not provided'}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Member Since</label>
                      <div className="p-2 bg-gray-50 rounded">
                        {format(new Date(studentData?.joined_date || new Date()), 'MMMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* BJJ Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    BJJ Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Current Belt</label>
                      <div className="p-2 bg-gray-50 rounded">{studentData?.belt || 'White'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Coach</label>
                      <div className="p-2 bg-gray-50 rounded">{studentData?.coach || 'Not assigned'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Weight (kg)</label>
                      {isEditing ? (
                        <Input
                          value={profileForm.weight}
                          onChange={(e) => setProfileForm({ ...profileForm, weight: e.target.value })}
                          placeholder="Your weight"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{bjjProfile?.weight_kg || 'Not provided'}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Height (cm)</label>
                      {isEditing ? (
                        <Input
                          value={profileForm.height}
                          onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                          placeholder="Your height"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{bjjProfile?.height_cm || 'Not provided'}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Favorite Position</label>
                      {isEditing ? (
                        <Input
                          value={profileForm.favoritePosition}
                          onChange={(e) => setProfileForm({ ...profileForm, favoritePosition: e.target.value })}
                          placeholder="e.g., Closed Guard"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{bjjProfile?.favorite_position || 'Not provided'}</div>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Favorite Submission</label>
                      {isEditing ? (
                        <Input
                          value={profileForm.favoriteSubmission}
                          onChange={(e) => setProfileForm({ ...profileForm, favoriteSubmission: e.target.value })}
                          placeholder="e.g., Triangle Choke"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded">{bjjProfile?.favorite_submission || 'Not provided'}</div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div>
                      <label className="text-sm font-medium">About Me</label>
                      <Textarea
                        value={profileForm.about}
                        onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                        placeholder="Tell us about your BJJ journey..."
                        rows={4}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Subscription Information */}
              {studentData?.subscription_plans && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Subscription Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Plan Name</label>
                        <div className="p-2 bg-gray-50 rounded">
                          {(studentData.subscription_plans as any)?.title}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Billing Period</label>
                        <div className="p-2 bg-gray-50 rounded">
                          {(studentData.subscription_plans as any)?.subscription_period}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Classes Included</label>
                        <div className="p-2 bg-gray-50 rounded">
                          {(studentData.subscription_plans as any)?.number_of_classes} classes
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Price</label>
                        <div className="p-2 bg-gray-50 rounded">
                          ${(studentData.subscription_plans as any)?.standard_price}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Badge variant={studentData.payment_status === 'paid' ? 'default' : 'destructive'}>
                        {studentData.payment_status?.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Payment History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;
