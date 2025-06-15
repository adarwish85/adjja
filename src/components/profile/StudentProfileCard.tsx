
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { getBeltColor } from "@/lib/beltColors";
import { format } from "date-fns";

interface StudentProfileCardProps {
  name: string;
  profilePicture?: string;
  belt?: string;
  stripes?: number;
  joinedDate?: string | Date;
  onAvatarEdit?: () => void;
}

export function StudentProfileCard({
  name,
  profilePicture,
  belt,
  stripes,
  joinedDate,
  onAvatarEdit
}: StudentProfileCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-amber-100 via-yellow-50 to-white rounded-3xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-6">
      <div className="relative group">
        <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-white shadow">
          <AvatarImage src={profilePicture} />
          <AvatarFallback className="bg-bjj-gold text-white text-2xl">
            {name?.charAt(0).toUpperCase() || 'A'}
          </AvatarFallback>
        </Avatar>
        {onAvatarEdit && (
          <button
            onClick={onAvatarEdit}
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 border shadow-lg opacity-90 hover:opacity-100 transition"
            type="button"
            aria-label="Change Avatar"
            title="Change Avatar"
          >
            <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5H3v-4L16.5 3.5Z" /></svg>
          </button>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-2 justify-center items-center md:items-start">
        <h2 className="text-2xl md:text-3xl font-bold text-bjj-navy font-playfair mb-1">{name}</h2>
        <div className="flex items-center gap-2 mb-1">
          {belt && (
            <Badge className={`px-4 py-1 font-semibold rounded-full ${getBeltColor(belt)}`}>
              {belt} Belt
              {typeof stripes === "number" && (
                <span className="ml-2 text-xs font-normal text-gray-800">
                  • {stripes} {stripes === 1 ? 'Stripe' : 'Stripes'}
                </span>
              )}
            </Badge>
          )}
        </div>
        {joinedDate && (
          <div className="flex items-center gap-1 text-gray-700 text-sm">
            <Calendar className="h-4 w-4 mr-1 text-bjj-gold" />
            Member since {format(new Date(joinedDate), "MMM yyyy")}
          </div>
        )}
      </div>
    </div>
  );
}
