
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";

export const StudentWelcome = () => {
  return (
    <Card className="bg-gradient-to-r from-bjj-navy to-bjj-navy-light text-white">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, Alex!</h1>
              <Badge className="bg-bjj-gold text-bjj-navy font-semibold">
                Blue Belt - 2 Stripes
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-bjj-gold-light">
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
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button 
              size="lg" 
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy font-semibold"
            >
              Check In to Class
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-bjj-navy"
            >
              View Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
