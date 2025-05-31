
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
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
import { usePaymentAnalytics } from "@/hooks/usePaymentAnalytics";

export const RevenueAnalytics = () => {
  const { data: paymentData, isLoading } = usePaymentAnalytics();

  if (isLoading) {
    return <div className="p-6 text-center">Loading revenue analytics...</div>;
  }

  const revenueMetrics = [
    { 
      title: "Monthly Revenue", 
      value: `$${paymentData?.monthlyRevenue?.toFixed(2) || '0.00'}`, 
      change: "+18.2%", 
      icon: DollarSign, 
      color: "text-green-600", 
      bgColor: "bg-green-100" 
    },
    { 
      title: "Total Revenue", 
      value: `$${paymentData?.totalRevenue?.toFixed(2) || '0.00'}`, 
      change: "+22.1%", 
      icon: Calendar, 
      color: "text-blue-600", 
      bgColor: "bg-blue-100" 
    },
    { 
      title: "Average Order Value", 
      value: `$${paymentData?.averageOrderValue?.toFixed(2) || '0.00'}`, 
      change: "+5.3%", 
      icon: Target, 
      color: "text-purple-600", 
      bgColor: "bg-purple-100" 
    },
    { 
      title: "Conversion Rate", 
      value: `${paymentData?.conversionRate?.toFixed(1) || '0.0'}%`, 
      change: "+1.1%", 
      icon: CreditCard, 
      color: "text-orange-600", 
      bgColor: "bg-orange-100" 
    },
  ];

  const revenueBySource = [
    { name: 'Subscriptions', value: 65, color: '#3B82F6', percentage: 65 },
    { name: 'Course Sales', value: 25, color: '#10B981', percentage: 25 },
    { name: 'Merchandise', value: 10, color: '#F59E0B', percentage: 10 },
  ];

  const forecastData = [
    { month: 'Jan', actual: paymentData?.monthlyRevenue || 0, forecast: (paymentData?.monthlyRevenue || 0) * 1.03 },
    { month: 'Feb', actual: null, forecast: (paymentData?.monthlyRevenue || 0) * 1.07 },
    { month: 'Mar', actual: null, forecast: (paymentData?.monthlyRevenue || 0) * 1.10 },
    { month: 'Apr', actual: null, forecast: (paymentData?.monthlyRevenue || 0) * 1.14 },
    { month: 'May', actual: null, forecast: (paymentData?.monthlyRevenue || 0) * 1.17 },
    { month: 'Jun', actual: null, forecast: (paymentData?.monthlyRevenue || 0) * 1.22 },
  ];

  const topRevenueStreams = [
    { name: "Premium Subscriptions", amount: `$${((paymentData?.monthlyRevenue || 0) * 0.4).toFixed(0)}`, percentage: 40.0, growth: "+15%" },
    { name: "Basic Subscriptions", amount: `$${((paymentData?.monthlyRevenue || 0) * 0.25).toFixed(0)}`, percentage: 25.0, growth: "+12%" },
    { name: "Course Sales", amount: `$${((paymentData?.monthlyRevenue || 0) * 0.20).toFixed(0)}`, percentage: 20.0, growth: "+28%" },
    { name: "Private Training", amount: `$${((paymentData?.monthlyRevenue || 0) * 0.10).toFixed(0)}`, percentage: 10.0, growth: "+45%" },
    { name: "Merchandise", amount: `$${((paymentData?.monthlyRevenue || 0) * 0.05).toFixed(0)}`, percentage: 5.0, growth: "+22%" },
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
            <CardTitle className="text-bjj-navy">Revenue Trends</CardTitle>
            <p className="text-sm text-bjj-gray">Monthly revenue over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={paymentData?.revenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Revenue ($)"
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
