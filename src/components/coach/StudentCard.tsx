
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Student } from "@/hooks/useStudents";
import { Calendar, UserCheck, StickyNote, User } from "lucide-react";

interface StudentCardProps {
  student: Student;
  onViewDetails: (student: Student) => void;
  onAddNote: (student: Student) => void;
  onCheckIn: (student: Student) => void;
}

export const StudentCard = ({ student, onViewDetails, onAddNote, onCheckIn }: StudentCardProps) => {
  const getBeltColor = (belt: string) => {
    const colors: Record<string, string> = {
      'White': 'bg-gray-100 text-gray-800',
      'Blue': 'bg-blue-100 text-blue-800',
      'Purple': 'bg-purple-100 text-purple-800',
      'Brown': 'bg-amber-100 text-amber-800',
      'Black': 'bg-gray-900 text-white'
    };
    return colors[belt] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'on-hold': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-bjj-gold text-white">
                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{student.name}</CardTitle>
              <p className="text-sm text-gray-600">{student.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={getBeltColor(student.belt)}>
              {student.belt} {student.stripes > 0 && `(${student.stripes})`}
            </Badge>
            <Badge className={getStatusColor(student.status)}>
              {student.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Branch</p>
            <p className="font-medium">{student.branch}</p>
          </div>
          <div>
            <p className="text-gray-500">Attendance Rate</p>
            <p className="font-medium">{student.attendance_rate}%</p>
          </div>
          <div>
            <p className="text-gray-500">Last Attended</p>
            <p className="font-medium">
              {student.last_attended 
                ? new Date(student.last_attended).toLocaleDateString()
                : 'Never'
              }
            </p>
          </div>
          <div>
            <p className="text-gray-500">Membership</p>
            <p className="font-medium">{student.membership_type}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewDetails(student)}
            className="flex-1"
          >
            <User className="h-4 w-4 mr-1" />
            Details
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAddNote(student)}
          >
            <StickyNote className="h-4 w-4 mr-1" />
            Note
          </Button>
          <Button 
            size="sm" 
            onClick={() => onCheckIn(student)}
            className="bg-bjj-gold hover:bg-bjj-gold-dark"
          >
            <UserCheck className="h-4 w-4 mr-1" />
            Check-in
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
