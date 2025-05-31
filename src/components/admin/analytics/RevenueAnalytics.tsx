
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  Calendar,
  Target,
  Download,
  Filter
} from "lucide-react";

export const RevenueAnalytics = () => {
  const revenueMetrics = [
    { title: "Monthly Revenue", value: "$89,450", change: "+18.2%", icon: DollarSign, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Annual Recurring", value: "$892,340", change: "+22.1%", icon: Calendar, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Average Per Student", value: "$42.80", change: "+5.3%", icon: Target, color: "text-purple-600", bgColor: "bg-purple-100" },
    { title: "Payment Success", value: "96.2%", change: "+1.1%", icon: CreditCard, color: "text-orange-600", bgColor: "bg-orange-100" },
  ];

  const monthlyRevenue = [
    { month: 'Jul', subscription: 45000, oneTime: 12000, merchandise: 3500, total: 60500 },
    { month: 'Aug', subscription: 48000, oneTime: 14500, merchandise: 4200, total: 66700 },
    { month: 'Sep', subscription: 52000, oneTime: 13800, merchandise: 3800, total: 69600 },
    { month: 'Oct', subscription: 55000, oneTime: 16200, merchandise: 4500, total: 75700 },
    { month: 'Nov', subscription: 58500, oneTime: 18000, merchandise: 5100, total: 81600 },
    { month: 'Dec', subscription: 62000, oneTime: 20200, merchandise: 7250, total: 89450 },
  ];

  const revenueBySource = [
    { name: 'Monthly Subscriptions', value: 62000, color: '#3B82F6', percentage: 69.3 },
    { name: 'One-time Payments', value: 20200, color: '#10B981', percentage: 22.6 },
    { name: 'Merchandise', value: 7250, color: '#F59E0B', percentage: 8.1 },
  ];

  const forecastData = [
    { month: 'Jan', actual: 89450, forecast: 92000 },
    { month: 'Feb', actual: null, forecast: 95500 },
    { month: 'Mar', actual: null, forecast: 98200 },
    { month: 'Apr', actual: null, forecast: 101800 },
    { month: 'May', actual: null, forecast: 105200 },
    { month: 'Jun', actual: null, forecast: 108900 },
  ];

  const topRevenueStreams = [
    { name: "Premium Memberships", amount: "$34,200", percentage: 38.3, growth: "+15%" },
    { name: "Basic Memberships", amount: "$27,800", percentage: 31.1, growth: "+12%" },
    { name: "Personal Training", amount: "$12,400", percentage: 13.9, growth: "+28%" },
    { name: "Workshops", amount: "$8,800", percentage: 9.8, growth: "+45%" },
    { name: "Merchandise", value: "$6,250", percentage: 7.0, growth: "+22%" },
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric) => (
          <Card key={metric.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{metric.value}</div>
              <p className="text-xs text-green-600">{metric.change} vs last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy">Revenue Analytics</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Revenue Breakdown</CardTitle>
            <p className="text-sm text-bjj-gray">Monthly revenue by source</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="subscription" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  name="Subscriptions"
                />
                <Area 
                  type="monotone" 
                  dataKey="oneTime" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981"
                  name="One-time"
                />
                <Area 
                  type="monotone" 
                  dataKey="merchandise" 
                  stackId="1"
                  stroke="#F59E0B" 
                  fill="#F59E0B"
                  name="Merchandise"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Revenue Sources</CardTitle>
            <p className="text-sm text-bjj-gray">Distribution by revenue type</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Revenue Forecast</CardTitle>
            <p className="text-sm text-bjj-gray">Projected revenue for next 6 months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  name="Actual Revenue"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Forecast"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Revenue Streams */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Top Revenue Streams</CardTitle>
            <p className="text-sm text-bjj-gray">Highest performing revenue sources</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRevenueStreams.map((stream, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-bjj-navy">{stream.name}</h4>
                    <p className="text-sm text-bjj-gray">{stream.percentage}% of total revenue</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-bjj-navy">{stream.amount}</div>
                    <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                      {stream.growth}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
