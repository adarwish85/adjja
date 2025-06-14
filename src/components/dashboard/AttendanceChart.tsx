
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const chartConfig = {
  attendance: {
    label: "Attendance",
    color: "#f6ad24",
  },
};

export const AttendanceChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy">Attendance Trends</CardTitle>
        <p className="text-sm text-bjj-gray">Monthly attendance across all branches</p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <div className="flex items-center justify-center h-full text-bjj-gray">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">No attendance data available</p>
              <p className="text-xs">Data will appear when students start attending classes</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
