
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, CheckCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import { StudentCheckInModal } from "@/components/attendance/StudentCheckInModal";
import { useState } from "react";

export const StudentWelcome = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { studentQuota } = useSmartAttendance();
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Extract first name from the user's name
  const firstName = userProfile?.name?.split(' ')[0] || 'Student';

  return (
    <>
      <Card className="bg-gradient-to-r from-bjj-navy to-bjj-navy-light text-white">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, {firstName}!</h1>
                  <Badge className="bg-bjj-gold text-bjj-navy font-semibold w-fit">
                    Blue Belt - 2 Stripes
                  </Badge>
                </div>
                
                {/* Info Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-bjj-gold-light">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Downtown Branch</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Member since 2022</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Bar - Unified and Aligned */}
            <div className="bg-black/20 rounded-lg p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Classes Remaining Info */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-bjj-gold/20 px-3 py-2 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-bjj-gold" />
                    <span className="font-medium text-bjj-gold">
                      {studentQuota?.is_unlimited ? 'Unlimited Classes' : `${studentQuota?.remaining_classes || 0} Classes Left`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-bjj-gold-light">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">This Month</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => setShowCheckInModal(true)} 
                    size="lg" 
                    className="bg-bjj-red hover:bg-bjj-red/90 text-white shadow-lg font-semibold"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Check In to Class
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => navigate("/student/schedule")} 
                      variant="outline" 
                      size="lg" 
                      className="border-white hover:bg-white hover:text-bjj-navy text-white font-medium"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                    <Button 
                      onClick={() => navigate("/student/progress")} 
                      variant="outline" 
                      size="lg" 
                      className="border-white hover:bg-white hover:text-bjj-navy text-white font-medium"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Progress
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StudentCheckInModal open={showCheckInModal} onOpenChange={setShowCheckInModal} />
    </>
  );
};
