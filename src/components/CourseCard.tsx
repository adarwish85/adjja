
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: string;
  category: string;
  price: number;
  rating?: number;
  studentCount?: number;
  duration?: string;
  thumbnailUrl?: string;
}

export const CourseCard = ({
  id,
  title,
  description,
  instructor,
  level,
  category,
  price,
  rating = 4.5,
  studentCount = 0,
  duration = "2h 30m",
  thumbnailUrl,
}: CourseCardProps) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/course/${id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewCourse}>
      <div className="relative aspect-video bg-gray-200">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bjj-navy to-bjj-gold flex items-center justify-center">
            <Play className="h-12 w-12 text-white opacity-80" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-bjj-gold text-black">{category}</Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>by {instructor}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{studentCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{duration}</span>
              </div>
            </div>
            <Badge variant="outline">{level}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-bjj-navy">
              {price > 0 ? `$${price}` : "Free"}
            </div>
            <Button 
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleViewCourse();
              }}
            >
              View Course
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
