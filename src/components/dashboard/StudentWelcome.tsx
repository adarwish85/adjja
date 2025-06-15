
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, CheckCircle, TrendingUp, User, GraduationCap } from "lucide-react";
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
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Extract first name from the user's name
  const firstName = userProfile?.name?.split(' ')[0] || 'Student';

  // Belt color mapping for better visual hierarchy
  const getBeltColor = (beltName: string) => {
    const beltColors = {
      'white': 'bg-gray-100 text-gray-900',
      'blue': 'bg-blue-600 text-white',
      'purple': 'bg-purple-600 text-white',
      'brown': 'bg-amber-800 text-white',
      'black': 'bg-gray-900 text-white',
    };
    
    const belt = beltName.toLowerCase().split(' ')[0];
    return beltColors[belt as keyof typeof beltColors] || 'bg-blue-600 text-white';
  };

  const handleCheckIn = () => {
    setShowCheckInModal(true);
  };

  const handleCheckInSuccess = () => {
    setIsCheckedIn(true);
    setShowCheckInModal(false);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white shadow-xl border-0">
        <CardContent className="p-6 lg:p-8">
          {/* Top Row - Welcome & Rank */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 text-white">
                Welcome back, {firstName}!
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Downtown Branch</span>
                </div>
                <div className="hidden sm:block text-gray-400">•</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Member since 2022</span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <Badge 
                className={`${getBeltColor('Blue Belt')} px-4 py-2 text-sm font-semibold rounded-full shadow-lg border-0`}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Blue Belt - 2 Stripes
              </Badge>
            </div>
          </div>

          {/* Middle Row - Class Info Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Left Block - Classes Info */}
              <div className="flex items-center gap-4">
                <div className="bg-amber-500/20 p-3 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl lg:text-4xl font-bold text-white">
                      {studentQuota?.is_unlimited ? '∞' : studentQuota?.remaining_classes || 0}
                    </span>
                    <span className="text-amber-400 font-semibold">
                      {studentQuota?.is_unlimited ? 'Unlimited' : 'Classes Left'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm font-medium mt-1">This Month</p>
                </div>
              </div>

              {/* Right Block - Check In CTA */}
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleCheckIn}
                  disabled={isCheckedIn}
                  size="lg" 
                  className={`
                    w-full lg:w-auto font-semibold text-base px-6 py-3 rounded-xl transition-all duration-200
                    ${isCheckedIn 
                      ? 'bg-green-600 text-white cursor-not-allowed opacity-90' 
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-900 hover:text-slate-900 shadow-lg hover:shadow-xl transform hover:scale-105'
                    }
                  `}
                >
                  {isCheckedIn ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      ✅ Checked In
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Check In to Class
                    </>
                  )}
                </Button>
                
                {/* Secondary Actions */}
                <div className="flex flex-col sm:flex-row gap-2 lg:gap-3">
                  <Button 
                    onClick={() => navigate("/student/schedule")} 
                    variant="outline" 
                    size="sm"
                    className="flex-1 border-white/30 hover:border-white hover:bg-white/10 text-white hover:text-white font-medium transition-all duration-200"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">View Schedule</span>
                    <span className="sm:hidden">Schedule</span>
                  </Button>
                  <Button 
                    onClick={() => navigate("/student/progress")} 
                    variant="outline" 
                    size="sm"
                    className="flex-1 border-white/30 hover:border-white hover:bg-white/10 text-white hover:text-white font-medium transition-all duration-200"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">View Progress</span>
                    <span className="sm:hidden">Progress</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StudentCheckInModal 
        open={showCheckInModal} 
        onOpenChange={setShowCheckInModal}
        onSuccess={handleCheckInSuccess}
      />
    </>
  );
};
