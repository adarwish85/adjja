
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import { StudentCheckInModal } from "@/components/attendance/StudentCheckInModal";
import { QuotaDisplay } from "@/components/attendance/QuotaDisplay";
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
          <div className="flex flex-col space-y-4">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                  <h1 className="text-2xl lg:text-3xl font-bold">Welcome back, {firstName}!</h1>
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
              
              {/* Right side - Quota and Check-in */}
              <div className="flex flex-col sm:flex-row items-end lg:items-start gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2 text-bjj-gold-light mb-2">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {studentQuota?.is_unlimited ? 'Unlimited' : `${studentQuota?.remaining_classes || 0} classes left`}
                    </span>
                  </div>
                  <Button 
                    onClick={() => setShowCheckInModal(true)} 
                    size="lg" 
                    className="bg-bjj-red hover:bg-bjj-red/90 text-white shadow-lg whitespace-nowrap"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Check In to Class
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={() => navigate("/student/schedule")} 
                variant="outline" 
                size="lg" 
                className="border-white hover:bg-white hover:text-bjj-navy text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Button>
              <Button 
                onClick={() => navigate("/student/progress")} 
                variant="outline" 
                size="lg" 
                className="border-white hover:bg-white hover:text-bjj-navy text-white"
              >
                View Progress
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <StudentCheckInModal open={showCheckInModal} onOpenChange={setShowCheckInModal} />
    </>
  );
};
