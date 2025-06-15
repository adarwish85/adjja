
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, CheckCircle, TrendingUp, GraduationCap, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import { useClassReminder } from "@/hooks/useClassReminder";
import { StudentCheckInModal } from "@/components/attendance/StudentCheckInModal";
import { ClassReminder } from "@/components/dashboard/ClassReminder";
import { useState, useEffect } from "react";

export const StudentWelcome = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { studentQuota } = useSmartAttendance();
  const { todaysClasses, shouldShowReminder, checkInStatus } = useClassReminder();
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Extract first name from the user's name
  const firstName = userProfile?.name?.split(' ')[0] || 'Student';

  // Belt color mapping for better visual hierarchy
  const getBeltColor = (beltName: string) => {
    const beltColors = {
      'white': 'bg-gray-100 text-gray-900 border-gray-200',
      'blue': 'bg-blue-600 text-white border-blue-700',
      'purple': 'bg-purple-600 text-white border-purple-700',
      'brown': 'bg-amber-800 text-white border-amber-900',
      'black': 'bg-gray-900 text-white border-gray-800'
    };
    const belt = beltName.toLowerCase().split(' ')[0];
    return beltColors[belt as keyof typeof beltColors] || 'bg-blue-600 text-white border-blue-700';
  };

  const handleCheckIn = () => {
    if (checkInStatus.canCheckIn) {
      setShowCheckInModal(true);
    }
  };

  return (
    <>
      {/* Class Reminder */}
      {shouldShowReminder && (
        <div className="mb-6">
          <ClassReminder classes={todaysClasses} />
        </div>
      )}

      <Card className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          {/* Hero Section */}
          <div className="relative p-6 lg:p-8">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 to-transparent pointer-events-none" />
            
            {/* Top Row - Welcome & Belt Badge */}
            <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
              {/* Welcome Section */}
              <div className="flex-1 space-y-4">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                  Welcome back, {firstName}!
                </h1>
                
                {/* Branch & Member Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/20 rounded-full">
                      <MapPin className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-sm font-medium">Downtown Branch</span>
                  </div>
                  <div className="hidden sm:block text-gray-500">•</div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/20 rounded-full">
                      <Clock className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-sm font-medium">Member since 2022</span>
                  </div>
                </div>
              </div>
              
              {/* Belt Badge */}
              <div className="flex-shrink-0">
                <Badge className={`${getBeltColor('Blue Belt')} px-6 py-3 text-base font-bold rounded-full shadow-lg backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105`}>
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Blue Belt - 2 Stripes
                </Badge>
              </div>
            </div>

            {/* Main Action Section */}
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10 shadow-inner">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left: Classes Stats */}
                <div className="flex items-center gap-6">
                  {/* Stats Icon */}
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-4 rounded-2xl shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  
                  {/* Stats Content */}
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl lg:text-5xl font-black text-white">
                        {studentQuota?.is_unlimited ? '∞' : studentQuota?.remaining_classes || 12}
                      </span>
                      <span className="text-amber-400 font-bold text-lg">
                        {studentQuota?.is_unlimited ? 'Unlimited' : 'Classes Left'}
                      </span>
                    </div>
                    <p className="text-gray-300 font-medium">This Month</p>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="space-y-4">
                  {/* Check-in Status Message */}
                  {!checkInStatus.canCheckIn && checkInStatus.reason && (
                    <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 rounded-lg p-3">
                      <AlertCircle className="h-4 w-4" />
                      <span>{checkInStatus.reason}</span>
                    </div>
                  )}

                  {/* Primary CTA */}
                  <Button 
                    onClick={handleCheckIn}
                    disabled={!checkInStatus.canCheckIn || isCheckedIn}
                    size="lg"
                    className={`
                      w-full font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg
                      ${isCheckedIn 
                        ? 'bg-green-600 hover:bg-green-600 text-white cursor-not-allowed opacity-90' 
                        : checkInStatus.canCheckIn
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 hover:text-slate-900 shadow-amber-500/25 hover:shadow-amber-500/40 hover:shadow-xl transform hover:scale-[1.02]'
                        : 'bg-gray-600 hover:bg-gray-600 text-gray-300 cursor-not-allowed'
                      }
                    `}
                  >
                    {isCheckedIn ? (
                      <>
                        <CheckCircle className="h-6 w-6 mr-3" />
                        ✅ Checked In
                      </>
                    ) : checkInStatus.canCheckIn ? (
                      <>
                        <CheckCircle className="h-6 w-6 mr-3" />
                        Check In to Class
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-6 w-6 mr-3" />
                        Check-In Unavailable
                      </>
                    )}
                  </Button>
                  
                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => navigate("/student/schedule")}
                      variant="outline"
                      size="lg"
                      className="font-semibold transition-all duration-300 border-white/20 hover:border-white/40 text-white hover:text-white bg-slate-800/50 hover:bg-slate-700/70 backdrop-blur-sm rounded-xl py-3"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">View Schedule</span>
                      <span className="sm:hidden">Schedule</span>
                    </Button>
                    <Button
                      onClick={() => navigate("/student/progress")}
                      variant="outline"
                      size="lg"
                      className="font-semibold transition-all duration-300 border-white/20 hover:border-white/40 text-white hover:text-white bg-slate-800/50 hover:bg-slate-700/70 backdrop-blur-sm rounded-xl py-3"
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      <span className="hidden sm:inline">View Progress</span>
                      <span className="sm:hidden">Progress</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StudentCheckInModal 
        open={showCheckInModal} 
        onOpenChange={setShowCheckInModal}
      />
    </>
  );
};
