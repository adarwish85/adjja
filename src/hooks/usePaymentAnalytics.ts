
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentAnalytics = () => {
  const { data: paymentStats } = useQuery({
    queryKey: ['payment-analytics'],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: subscriptions } = await supabase
        .from('subscribers')
        .select('*');

      // Calculate metrics
      const totalRevenue = orders?.filter(o => o.status === 'paid')
        .reduce((sum, order) => sum + order.amount, 0) || 0;

      const currentMonth = new Date().getMonth();
      const thisMonthOrders = orders?.filter(order => 
        new Date(order.created_at).getMonth() === currentMonth
      ) || [];

      const monthlyRevenue = thisMonthOrders
        .filter(o => o.status === 'paid')
        .reduce((sum, order) => sum + order.amount, 0);

      const totalTransactions = orders?.length || 0;
      const successfulPayments = orders?.filter(o => o.status === 'paid').length || 0;
      const conversionRate = totalTransactions > 0 ? (successfulPayments / totalTransactions) * 100 : 0;

      const activeSubscriptions = subscriptions?.filter(s => s.subscribed).length || 0;
      const averageOrderValue = successfulPayments > 0 ? totalRevenue / successfulPayments : 0;

      // Revenue by month (last 6 months)
      const revenueByMonth = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthOrders = orders?.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= monthStart && orderDate <= monthEnd && order.status === 'paid';
        }) || [];

        const monthRevenue = monthOrders.reduce((sum, order) => sum + order.amount, 0);

        revenueByMonth.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          revenue: monthRevenue,
          transactions: monthOrders.length
        });
      }

      // Payment methods distribution
      const paymentMethods = [
        { name: 'Credit Card', value: 65, color: '#3B82F6' },
        { name: 'PayPal', value: 20, color: '#10B981' },
        { name: 'PIX', value: 10, color: '#F59E0B' },
        { name: 'Bank Transfer', value: 5, color: '#6B7280' },
      ];

      return {
        totalRevenue: totalRevenue / 100,
        monthlyRevenue: monthlyRevenue / 100,
        averageOrderValue: averageOrderValue / 100,
        conversionRate,
        activeSubscriptions,
        totalTransactions,
        successfulPayments,
        revenueByMonth: revenueByMonth.map(month => ({
          ...month,
          revenue: month.revenue / 100
        })),
        paymentMethods,
        orders: orders || []
      };
    }
  });

  return {
    data: paymentStats,
    isLoading: !paymentStats
  };
};
