
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Users, 
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Plus
} from "lucide-react";

export const PaymentsOverview = () => {
  const kpiData = [
    {
      title: "Total Revenue",
      value: "$45,892",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Subscriptions",
      value: "324",
      change: "+8",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Transactions",
      value: "1,247",
      change: "+89",
      changeType: "positive" as const,
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Average Order Value",
      value: "$37.80",
      change: "+2.3%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-bjj-gold-dark",
      bgColor: "bg-yellow-100",
    },
  ];

  const recentTransactions = [
    { id: "TXN-001", customer: "João Silva", amount: "$49.99", status: "completed", method: "Credit Card", time: "2 minutes ago" },
    { id: "TXN-002", customer: "Maria Santos", amount: "$29.99", status: "pending", method: "PayPal", time: "15 minutes ago" },
    { id: "TXN-003", customer: "Carlos Mendes", amount: "$79.99", status: "completed", method: "Credit Card", time: "1 hour ago" },
    { id: "TXN-004", customer: "Ana Costa", amount: "$19.99", status: "failed", method: "Bank Transfer", time: "2 hours ago" },
    { id: "TXN-005", customer: "Roberto Lima", amount: "$99.99", status: "completed", method: "Credit Card", time: "3 hours ago" },
  ];

  const paymentAlerts = [
    { type: "warning", message: "3 failed payments in the last hour", count: 3 },
    { type: "info", message: "Monthly billing cycle starts in 2 days", count: null },
    { type: "error", message: "Payment gateway maintenance scheduled", count: null },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{kpi.value}</div>
              <p className="text-xs text-green-600">
                {kpi.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
              <Plus className="h-4 w-4 mr-2" />
              Manual Payment
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Payments
            </Button>
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <h4 className="font-medium text-bjj-navy text-sm">{transaction.customer}</h4>
                      <p className="text-xs text-bjj-gray">{transaction.id} • {transaction.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-bjj-navy">{transaction.amount}</div>
                    <Badge variant="outline" className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Payment Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  alert.type === 'error' ? 'bg-red-50 border border-red-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {alert.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      {alert.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      {alert.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-600" />}
                      <p className="text-sm text-bjj-navy">{alert.message}</p>
                    </div>
                    {alert.count && (
                      <Badge variant="outline" className="text-xs">
                        {alert.count}
                      </Badge>
                    )}
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
