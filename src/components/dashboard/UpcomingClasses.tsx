
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClassData {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  location: string;
}

const useTodayClasses = () => {
  return useQuery({
    queryKey: ['today-classes'],
    queryFn: async (): Promise<ClassData[]> => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('status', 'Active')
        .order('name');

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};

export const UpcomingClasses = () => {
  const { data: classes, isLoading } = useTodayClasses();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Classes
        </CardTitle>
        <p className="text-sm text-bjj-gray">Active classes across all branches</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-red"></div>
          </div>
        ) : classes && classes.length > 0 ? (
          <div className="space-y-4 max-h-[200px] overflow-y-auto">
            {classes.slice(0, 5).map((class_) => (
              <div key={class_.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-semibold text-bjj-navy">{class_.name}</h4>
                  <p className="text-sm text-bjj-gray flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {class_.instructor}
                  </p>
                  <p className="text-sm text-bjj-gray flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {class_.schedule}
                  </p>
                  <p className="text-xs text-bjj-gray">{class_.location}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {class_.enrolled}/{class_.capacity}
                  </Badge>
                  <p className="text-xs text-bjj-gray">enrolled</p>
                </div>
              </div>
            ))}
            {classes.length > 5 && (
              <p className="text-sm text-bjj-gray text-center pt-2">
                +{classes.length - 5} more classes
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-bjj-gray">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No classes scheduled</p>
            <p className="text-xs">Classes will appear here when scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
