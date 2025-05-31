
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  MoreHorizontal,
  Calendar,
  Users,
  DollarSign,
  TrendingUp
} from "lucide-react";

export const SubscriptionManagement = () => {
  const subscriptionStats = [
    { title: "Active Subscriptions", value: "324", icon: Users, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Monthly Revenue", value: "$12,450", icon: DollarSign, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Churn Rate", value: "2.3%", icon: TrendingUp, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { title: "Renewals This Month", value: "89", icon: Calendar, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  const subscriptions = [
    {
      id: "SUB-001",
      customer: "João Silva",
      email: "joao@email.com",
      plan: "Premium Monthly",
      amount: "$29.99",
      status: "active",
      nextBilling: "2024-02-15",
      created: "2023-12-15"
    },
    {
      id: "SUB-002",
      customer: "Maria Santos",
      email: "maria@email.com",
      plan: "Basic Monthly",
      amount: "$19.99",
      status: "active",
      nextBilling: "2024-02-10",
      created: "2024-01-10"
    },
    {
      id: "SUB-003",
      customer: "Carlos Mendes",
      email: "carlos@email.com",
      plan: "Premium Annual",
      amount: "$299.99",
      status: "cancelled",
      nextBilling: "N/A",
      created: "2023-11-20"
    },
    {
      id: "SUB-004",
      customer: "Ana Costa",
      email: "ana@email.com",
      plan: "Basic Monthly",
      amount: "$19.99",
      status: "past_due",
      nextBilling: "2024-01-20",
      created: "2023-10-15"
    },
    {
      id: "SUB-005",
      customer: "Roberto Lima",
      email: "roberto@email.com",
      plan: "Premium Monthly",
      amount: "$29.99",
      status: "paused",
      nextBilling: "2024-03-01",
      created: "2023-09-05"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "past_due": return "bg-yellow-100 text-yellow-800";
      case "paused": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: string) => {
    if (plan.includes("Premium")) return "bg-purple-100 text-purple-800";
    if (plan.includes("Basic")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Subscription Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Subscription Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by customer, email, or subscription ID..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">All Subscriptions</CardTitle>
          <p className="text-sm text-bjj-gray">Manage recurring subscriptions and billing</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscription ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      {subscription.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{subscription.customer}</div>
                        <div className="text-sm text-bjj-gray">{subscription.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPlanColor(subscription.plan)}>
                        {subscription.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {subscription.amount}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(subscription.status)}>
                        {subscription.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{subscription.nextBilling}</TableCell>
                    <TableCell>{subscription.created}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
