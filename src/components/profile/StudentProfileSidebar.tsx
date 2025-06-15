
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBeltColor } from "@/lib/beltColors";
import { BeltProgressBar } from "@/components/profile/BeltProgressBar";
import { Calendar, Award, Target } from "lucide-react";
import { format } from "date-fns";

interface StudentProfileSidebarProps {
  formState: {
    belt?: string;
    stripes?: number;
    joined_date?: string | Date;
  };
}

export function StudentProfileSidebar({ formState }: StudentProfileSidebarProps) {
  // Mock data for classes left - in a real app this would come from the backend
  const classesLeft = 12;

  return (
    <div className="space-y-6">
      {/* Belt Information */}
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="h-5 w-5 text-bjj-gold" />
            Current Rank
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formState.belt && (
            <>
              <Badge className={`w-full justify-center py-3 text-base font-semibold ${getBeltColor(formState.belt)}`}>
                {formState.belt} Belt
              </Badge>
              
              <BeltProgressBar 
                belt={formState.belt} 
                stripes={formState.stripes || 0} 
              />
              
              <div className="text-center text-sm text-gray-600">
                {formState.stripes || 0} of {formState.belt?.toLowerCase() === 'black' ? '6' : '4'} stripes earned
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Membership Info */}
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-bjj-gold" />
            Membership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formState.joined_date && (
            <div className="text-center">
              <div className="text-2xl font-bold text-bjj-navy">
                {format(new Date(formState.joined_date), "MMM yyyy")}
              </div>
              <div className="text-sm text-gray-600">Member since</div>
            </div>
          )}
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Classes remaining</span>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-bjj-gold" />
                <span className="font-semibold text-bjj-navy">{classesLeft}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm text-gray-600">Attendance Rate</span>
            <span className="font-semibold text-green-600">85%</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-sm text-gray-600">Classes This Month</span>
            <span className="font-semibold text-bjj-navy">8</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Total Classes</span>
            <span className="font-semibold text-bjj-navy">156</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
