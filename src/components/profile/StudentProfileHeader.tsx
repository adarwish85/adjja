
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit3 } from "lucide-react";
import { getBeltColor } from "@/lib/beltColors";
import { format } from "date-fns";

interface StudentProfileHeaderProps {
  formState: {
    name: string;
    profile_picture_url?: string;
    cover_photo_url?: string;
    belt?: string;
    stripes?: number;
    joined_date?: string | Date;
  };
  onCoverPhotoEdit: () => void;
  onAvatarEdit: () => void;
  loading: boolean;
}

export function StudentProfileHeader({
  formState,
  onCoverPhotoEdit,
  onAvatarEdit,
  loading
}: StudentProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="relative h-80 w-full overflow-hidden bg-gradient-to-br from-bjj-gold/20 via-amber-50 to-white">
        {formState.cover_photo_url ? (
          <img 
            src={formState.cover_photo_url} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bjj-gold/30 via-amber-100 to-white" />
        )}
        
        {/* Cover Photo Edit Button */}
        <button
          onClick={onCoverPhotoEdit}
          disabled={loading}
          className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-xl p-3 shadow-lg transition-all duration-200 hover:scale-105"
          type="button"
        >
          <Edit3 className="h-5 w-5 text-gray-700" />
        </button>

        {/* Profile Photo - Overlapping */}
        <div className="absolute -bottom-20 left-8">
          <div className="relative">
            <Avatar className="h-40 w-40 border-6 border-white shadow-xl">
              <AvatarImage src={formState.profile_picture_url} />
              <AvatarFallback className="bg-bjj-gold text-white text-4xl font-bold">
                {formState.name?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            
            {/* Avatar Edit Button */}
            <button
              onClick={onAvatarEdit}
              disabled={loading}
              className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg border-2 border-white hover:bg-gray-50 transition-all duration-200"
              type="button"
              aria-label="Change Avatar"
            >
              <Edit3 className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Info Below Cover */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="pt-24 pb-6 ml-48">
            <div className="space-y-4">
              {/* Name */}
              <h1 className="text-4xl font-bold text-gray-900">
                {formState.name}
              </h1>
              
              {/* Belt and Member Info */}
              <div className="flex flex-wrap items-center gap-4">
                {formState.belt && (
                  <Badge className={`px-4 py-2 text-sm font-semibold rounded-full ${getBeltColor(formState.belt)}`}>
                    {formState.belt} Belt
                    {typeof formState.stripes === "number" && formState.stripes > 0 && (
                      <span className="ml-2 text-xs">
                        • {formState.stripes} {formState.stripes === 1 ? 'Stripe' : 'Stripes'}
                      </span>
                    )}
                  </Badge>
                )}
                
                {formState.joined_date && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      Member since {format(new Date(formState.joined_date), "MMMM yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
