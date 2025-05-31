
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "Jan", attendance: 186 },
  { month: "Feb", attendance: 205 },
  { month: "Mar", attendance: 237 },
  { month: "Apr", attendance: 203 },
  { month: "May", attendance: 248 },
  { month: "Jun", attendance: 264 },
];

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
        <ChartContainer config={chartConfig} className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#4a5568' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#4a5568' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#f6ad24" 
                strokeWidth={3}
                dot={{ fill: "#f6ad24", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#f6ad24", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
