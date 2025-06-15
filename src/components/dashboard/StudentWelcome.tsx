import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const StudentWelcome = () => {
  const navigate = useNavigate();
  return <Card className="bg-gradient-to-r from-bjj-navy to-bjj-navy-light text-white">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Header Section */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, Alex!</h1>
              <Badge className="bg-bjj-gold text-bjj-navy font-semibold w-fit">
                Blue Belt - 2 Stripes
              </Badge>
            </div>
            
            {/* Info Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-bjj-gold-light">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Downtown Branch</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Member since 2022</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={() => navigate("/student/schedule")} variant="outline" size="lg" className="border-white hover:bg-white text-zinc-950">
              <Calendar className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
            <Button onClick={() => navigate("/student/progress")} variant="outline" size="lg" className="border-white hover:bg-white text-zinc-950">
              View Progress
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};