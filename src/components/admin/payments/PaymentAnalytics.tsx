
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
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { usePaymentAnalytics } from "@/hooks/usePaymentAnalytics";

export const PaymentAnalytics = () => {
  const { data: paymentData, isLoading } = usePaymentAnalytics();

  if (isLoading) {
    return <div className="p-6 text-center">Loading payment analytics...</div>;
  }

  const metrics = [
    {
      title: "Total Revenue",
      value: `EGP ${paymentData?.totalRevenue?.toFixed(2) || '0.00'}`,
      change: "+15.3%",
      period: "vs last month",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Average Order Value",
      value: `EGP ${paymentData?.averageOrderValue?.toFixed(2) || '0.00'}`,
      change: "+8.2%",
      period: "vs last month",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Conversion Rate",
      value: `${paymentData?.conversionRate?.toFixed(1) || '0.0'}%`,
      change: "+0.5%",
      period: "vs last month",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Monthly Recurring Revenue",
      value: `EGP ${paymentData?.monthlyRevenue?.toFixed(2) || '0.00'}`,
      change: "+12.8%",
      period: "vs last month",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
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
              <p className="text-xs text-green-600">
                {metric.change} {metric.period}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy">Analytics Dashboard</CardTitle>
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
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Revenue Trend</CardTitle>
            <p className="text-sm text-bjj-gray">Monthly revenue and transaction volume</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentData?.revenueByMonth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`EGP ${value}`, name === 'revenue' ? 'Revenue (EGP)' : name]}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#D4AF37" 
                  strokeWidth={2}
                  name="Revenue (EGP)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">Payment Methods</CardTitle>
            <p className="text-sm text-bjj-gray">Distribution by payment method</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData?.paymentMethods || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {(paymentData?.paymentMethods || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Volume */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Transaction Volume</CardTitle>
          <p className="text-sm text-bjj-gray">Monthly transaction counts and trends</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData?.revenueByMonth || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="transactions" fill="#1E3A8A" name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
