
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, TrendingUp, Users } from "lucide-react";
import { PaymentActions } from "./PaymentActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const PaymentsOverview = () => {
  const { data: paymentStats } = useQuery({
    queryKey: ['payment-stats'],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('amount, status, created_at');
      
      const { data: subscribers } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier');

      const totalRevenue = orders?.reduce((sum, order) => 
        order.status === 'paid' ? sum + order.amount : sum, 0) || 0;
      
      const activeSubscriptions = subscribers?.filter(sub => sub.subscribed).length || 0;
      const totalTransactions = orders?.length || 0;
      const successfulPayments = orders?.filter(order => order.status === 'paid').length || 0;

      return {
        totalRevenue: totalRevenue / 100, // Convert from cents
        activeSubscriptions,
        totalTransactions,
        successfulPayments
      };
    }
  });

  const stats = [
    {
      title: "Total Revenue",
      value: `$${paymentStats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Active Subscriptions",
      value: paymentStats?.activeSubscriptions?.toString() || "0",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Transactions",
      value: paymentStats?.totalTransactions?.toString() || "0",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Success Rate",
      value: paymentStats?.totalTransactions ? 
        `${Math.round((paymentStats.successfulPayments / paymentStats.totalTransactions) * 100)}%` : "0%",
      icon: TrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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

      {/* Payment Actions */}
      <PaymentActions />
    </div>
  );
};
