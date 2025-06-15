
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface ClassReminderProps {
  classes: Array<{
    id: string;
    name: string;
    instructor: string;
    startTime: Date;
    endTime: Date;
  }>;
}

export const ClassReminder = ({ classes }: ClassReminderProps) => {
  if (classes.length === 0) return null;

  return (
    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500 rounded-full">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-amber-900">
                {classes.length === 1 ? 'Class Today!' : 'Classes Today!'}
              </h3>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                {classes.length} {classes.length === 1 ? 'class' : 'classes'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {classes.map(classItem => (
                <div key={classItem.id} className="bg-white/70 rounded-lg p-3 border border-amber-200">
                  <div className="font-medium text-amber-900 mb-1">
                    {classItem.name}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-amber-700">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(classItem.startTime, 'h:mm a')} - {format(classItem.endTime, 'h:mm a')}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {classItem.instructor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
