
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBJJProfile } from "@/hooks/useBJJProfile";
import { Trophy, Medal, Award, Instagram, Facebook, ExternalLink, MapPin, Calendar, Eye } from "lucide-react";

export default function PublicProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { getPublicProfile } = useBJJProfile();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProfile = async () => {
      if (!slug) return;
      
      setLoading(true);
      const data = await getPublicProfile(slug);
      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [slug, getPublicProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">This athlete profile doesn't exist or is set to private.</p>
        </div>
      </div>
    );
  }

  const totalMedals = (profile.gold_medals || 0) + (profile.silver_medals || 0) + (profile.bronze_medals || 0);
  const galleryImages = Array.isArray(profile.gallery_images) ? profile.gallery_images : [];

  const getBeltColor = (belt: string) => {
    const colors = {
      'White': 'bg-gray-100 text-gray-800',
      'Blue': 'bg-blue-100 text-blue-800',
      'Purple': 'bg-purple-100 text-purple-800',
      'Brown': 'bg-amber-100 text-amber-800',
      'Black': 'bg-gray-900 text-white'
    };
    return colors[belt as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-bjj-navy to-bjj-gold text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile.profiles?.profile_picture_url} />
              <AvatarFallback className="bg-bjj-gold text-white text-3xl">
                {profile.profiles?.name?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.profiles?.name}</h1>
              {profile.belt_rank && (
                <Badge className={`mb-2 ${getBeltColor(profile.belt_rank)}`}>
                  {profile.belt_rank} Belt
                </Badge>
              )}
              {profile.academy_team && (
                <p className="text-lg opacity-90 mb-2">{profile.academy_team}</p>
              )}
              <div className="flex items-center gap-4 text-sm opacity-75">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {profile.profile_views || 0} views
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            {profile.about_me && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{profile.about_me}</p>
                </CardContent>
              </Card>
            )}

            {/* Competition Stats */}
            {totalMedals > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-bjj-gold" />
                    Competition Statistics
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-bjj-navy">{profile.competitions_count || 0}</div>
                      <div className="text-sm text-gray-600">Competitions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                        <Medal className="h-5 w-5" />
                        {profile.gold_medals || 0}
                      </div>
                      <div className="text-sm text-gray-600">Gold</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-500 flex items-center justify-center gap-1">
                        <Medal className="h-5 w-5" />
                        {profile.silver_medals || 0}
                      </div>
                      <div className="text-sm text-gray-600">Silver</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600 flex items-center justify-center gap-1">
                        <Award className="h-5 w-5" />
                        {profile.bronze_medals || 0}
                      </div>
                      <div className="text-sm text-gray-600">Bronze</div>
                    </div>
                  </div>

                  {profile.notable_wins && (
                    <div>
                      <h3 className="font-medium mb-2">Notable Wins & Achievements</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{profile.notable_wins}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* BJJ Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">BJJ Details</h3>
                <div className="space-y-3">
                  {profile.weight_kg && (
                    <div>
                      <span className="text-sm text-gray-600">Weight:</span>
                      <span className="ml-2">{profile.weight_kg} kg</span>
                    </div>
                  )}
                  {profile.height_cm && (
                    <div>
                      <span className="text-sm text-gray-600">Height:</span>
                      <span className="ml-2">{profile.height_cm} cm</span>
                    </div>
                  )}
                  {profile.favorite_position && (
                    <div>
                      <span className="text-sm text-gray-600">Favorite Position:</span>
                      <span className="ml-2">{profile.favorite_position}</span>
                    </div>
                  )}
                  {profile.favorite_submission && (
                    <div>
                      <span className="text-sm text-gray-600">Favorite Submission:</span>
                      <span className="ml-2">{profile.favorite_submission}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* External Links */}
            {(profile.instagram_url || profile.facebook_url || profile.smoothcomp_url || profile.bjj_heroes_url || profile.other_link_1 || profile.other_link_2) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">External Links</h3>
                  <div className="space-y-2">
                    {profile.instagram_url && (
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4 mr-2" />
                          Instagram
                        </a>
                      </Button>
                    )}
                    {profile.facebook_url && (
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </a>
                      </Button>
                    )}
                    {profile.smoothcomp_url && (
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href={profile.smoothcomp_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Smoothcomp
                        </a>
                      </Button>
                    )}
                    {profile.bjj_heroes_url && (
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href={profile.bjj_heroes_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          BJJ Heroes
                        </a>
                      </Button>
                    )}
                    {profile.other_link_1 && (
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href={profile.other_link_1} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {profile.other_link_1_name || 'External Link'}
                        </a>
                      </Button>
                    )}
                    {profile.other_link_2 && (
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <a href={profile.other_link_2} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {profile.other_link_2_name || 'External Link'}
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
