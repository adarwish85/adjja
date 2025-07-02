
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, format } from "date-fns";

interface AttendanceData {
  date: string;
  attendance: number;
}

const useAttendanceChart = () => {
  return useQuery({
    queryKey: ['attendance-chart'],
    queryFn: async (): Promise<AttendanceData[]> => {
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), 29 - i);
        return format(date, 'yyyy-MM-dd');
      });

      const attendancePromises = last30Days.map(async (date) => {
        const { data, error } = await supabase
          .from('attendance_records')
          .select('id')
          .eq('attendance_date', date)
          .eq('status', 'present');

        if (error) throw error;
        
        return {
          date: format(new Date(date), 'MMM dd'),
          attendance: data?.length || 0,
        };
      });

      return Promise.all(attendancePromises);
    },
  });
};

export const AttendanceChart = () => {
  const { data: attendanceData, isLoading } = useAttendanceChart();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy">Attendance Trends</CardTitle>
        <p className="text-sm text-bjj-gray">Daily attendance over the last 30 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-red"></div>
            </div>
          ) : attendanceData && attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#DC2626" 
                  strokeWidth={2}
                  dot={{ fill: "#DC2626", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-bjj-gray">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm">No attendance data available</p>
                <p className="text-xs">Data will appear when students start attending classes</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
