
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SubscriptionManagement = () => {
  const { data: subscriptions, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: subscriptionStats } = useQuery({
    queryKey: ['subscription-stats'],
    queryFn: async () => {
      const activeCount = subscriptions?.filter(sub => sub.subscribed).length || 0;
      const monthlyRevenue = subscriptions?.reduce((sum, sub) => {
        if (!sub.subscribed) return sum;
        const tierAmount = sub.subscription_tier === 'Basic' ? 19.99 : 
                          sub.subscription_tier === 'Premium' ? 49.99 : 99.99;
        return sum + tierAmount;
      }, 0) || 0;

      return {
        activeSubscriptions: activeCount,
        monthlyRevenue,
        churnRate: "2.3%",
        renewalsThisMonth: Math.floor(activeCount * 0.8)
      };
    },
    enabled: !!subscriptions
  });

  const subscriptionStatsDisplay = [
    { title: "Active Subscriptions", value: subscriptionStats?.activeSubscriptions?.toString() || "0", icon: Users, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Monthly Revenue", value: `$${subscriptionStats?.monthlyRevenue?.toFixed(2) || '0.00'}`, icon: DollarSign, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Churn Rate", value: subscriptionStats?.churnRate || "0%", icon: TrendingUp, color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { title: "Renewals This Month", value: subscriptionStats?.renewalsThisMonth?.toString() || "0", icon: Calendar, color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  const getStatusColor = (subscribed: boolean) => {
    return subscribed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getPlanColor = (tier: string) => {
    if (tier?.includes("Premium")) return "bg-purple-100 text-purple-800";
    if (tier?.includes("Basic")) return "bg-blue-100 text-blue-800";
    if (tier?.includes("Enterprise")) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Subscription Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptionStatsDisplay.map((stat) => (
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
              <Button variant="outline" onClick={() => refetch()}>
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Billing</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions?.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>
                      <div>
                        <div className="text-sm text-bjj-gray">{subscription.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPlanColor(subscription.subscription_tier || '')}>
                        {subscription.subscription_tier || 'No Plan'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(subscription.subscribed)}>
                        {subscription.subscribed ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {subscription.subscription_end ? 
                        new Date(subscription.subscription_end).toLocaleDateString() : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      {new Date(subscription.created_at).toLocaleDateString()}
                    </TableCell>
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
