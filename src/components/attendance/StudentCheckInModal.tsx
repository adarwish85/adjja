
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users, AlertTriangle } from "lucide-react";
import { useSmartAttendance } from "@/hooks/useSmartAttendance";

interface StudentCheckInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StudentCheckInModal = ({ open, onOpenChange }: StudentCheckInModalProps) => {
  const { availableClasses, studentQuota, checkIn, isCheckingIn, loading } = useSmartAttendance();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const handleCheckIn = () => {
    if (selectedClass) {
      checkIn({ classId: selectedClass });
      onOpenChange(false);
      setSelectedClass(null);
    }
  };

  const enrolledClasses = availableClasses.filter(c => c.is_enrolled);
  const hasLowQuota = studentQuota && !studentQuota.is_unlimited && studentQuota.remaining_classes <= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-bjj-red" />
            Check In to Class
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quota Display */}
          {studentQuota && (
            <Card className={`${hasLowQuota ? 'border-orange-200 bg-orange-50' : 'border-green-200 bg-green-50'}`}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {studentQuota.is_unlimited ? 'Unlimited Classes' : 'Remaining Classes'}
                  </span>
                  <Badge variant={hasLowQuota ? "destructive" : "default"}>
                    {studentQuota.is_unlimited ? '∞' : studentQuota.remaining_classes}
                  </Badge>
                </div>
                {!studentQuota.is_unlimited && (
                  <div className="mt-1 text-xs text-gray-600">
                    {studentQuota.used_classes} of {studentQuota.total_classes} used this period
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Low Quota Warning */}
          {hasLowQuota && (
            <div className="flex items-start gap-2 p-3 bg-orange-100 border border-orange-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                You're running low on classes. Consider upgrading your plan to avoid interruptions.
              </div>
            </div>
          )}

          {/* Available Classes */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Today's Available Classes</h3>
            
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading classes...</div>
            ) : enrolledClasses.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No enrolled classes available today</p>
                <p className="text-xs mt-1">Contact your coach to get enrolled in classes</p>
              </div>
            ) : (
              enrolledClasses.map((classItem) => (
                <Card
                  key={classItem.class_id}
                  className={`cursor-pointer transition-all ${
                    classItem.already_checked_in
                      ? 'bg-green-50 border-green-200'
                      : selectedClass === classItem.class_id
                      ? 'ring-2 ring-bjj-red border-bjj-red'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => {
                    if (!classItem.already_checked_in) {
                      setSelectedClass(classItem.class_id);
                    }
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{classItem.class_name}</h4>
                        <p className="text-sm text-gray-600">
                          Instructor: {classItem.instructor}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{classItem.schedule}</span>
                        </div>
                      </div>
                      <div>
                        {classItem.already_checked_in ? (
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Checked In
                          </Badge>
                        ) : (
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedClass === classItem.class_id
                              ? 'bg-bjj-red border-bjj-red'
                              : 'border-gray-300'
                          }`} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Check In Button */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-bjj-red hover:bg-bjj-red/90"
              onClick={handleCheckIn}
              disabled={!selectedClass || isCheckingIn || (studentQuota && !studentQuota.is_unlimited && studentQuota.remaining_classes <= 0)}
              loading={isCheckingIn}
            >
              Confirm Check-In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
