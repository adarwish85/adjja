
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Users, AlertTriangle } from "lucide-react";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";
import { QuotaDisplay } from "./QuotaDisplay";

interface StudentCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StudentCheckInModal = ({ open, onOpenChange }: StudentCheckInModalProps) => {
  const { availableClasses, studentQuota, loading, checkIn, isCheckingIn } = useSmartAttendance();
  const [selectedClass, setSelectedClass] = useState<string>("");

  const handleCheckIn = async () => {
    if (!selectedClass) return;

    try {
      await checkIn({ classId: selectedClass });
      onOpenChange(false);
      setSelectedClass("");
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <Clock className="h-8 w-8 text-bjj-red mx-auto mb-4 animate-spin" />
              <p>Loading available classes...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-bjj-red" />
            Check In to Class
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Class Credits Display */}
          {studentQuota && (
            <QuotaDisplay quota={studentQuota} />
          )}

          {/* Available Classes */}
          <div>
            <h3 className="font-medium mb-3">Available Classes Today</h3>
            {availableClasses.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Classes Available</h3>
                  <p className="text-gray-500">
                    There are no classes available for check-in at this time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {availableClasses.map((cls) => (
                  <Card
                    key={cls.class_id}
                    className={`cursor-pointer transition-all ${
                      selectedClass === cls.class_id
                        ? 'ring-2 ring-bjj-red border-bjj-red'
                        : 'hover:shadow-md'
                    } ${
                      cls.already_checked_in ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => {
                      if (!cls.already_checked_in) {
                        setSelectedClass(cls.class_id);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{cls.class_name}</h4>
                            {cls.already_checked_in && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                ✓ Checked In
                              </Badge>
                            )}
                            {!cls.is_enrolled && (
                              <Badge variant="secondary">
                                Drop-in
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Instructor: {cls.instructor}
                          </p>
                          <p className="text-xs text-gray-500">
                            Schedule: {cls.schedule}
                          </p>
                        </div>
                        
                        {selectedClass === cls.class_id && !cls.already_checked_in && (
                          <CheckCircle className="h-6 w-6 text-bjj-red" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quota Warning */}
          {studentQuota && !studentQuota.is_unlimited && studentQuota.remaining_classes <= 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-medium">No Classes Remaining</p>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  You have used all classes in your current subscription. Please renew or upgrade your plan to continue.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCheckIn}
              disabled={!selectedClass || isCheckingIn || (studentQuota && !studentQuota.is_unlimited && studentQuota.remaining_classes <= 0)}
              className="bg-bjj-red hover:bg-bjj-red/90"
            >
              {isCheckingIn ? "Checking In..." : "Check In to Class"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
