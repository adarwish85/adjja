
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRevenueAnalytics = (dateRange?: { start?: Date; end?: Date }, branchId?: string) => {
  const startDate = dateRange?.start 
    ? new Date(dateRange.start).toISOString()
    : new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString();
  
  const endDate = dateRange?.end
    ? new Date(dateRange.end).toISOString()
    : new Date().toISOString();

  // Fetch revenue metrics from the materialized view
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-analytics', startDate, endDate, branchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_revenue_metrics')
        .select('*')
        .order('month');

      if (error) throw error;

      // Transform date format for visualization
      return data.map(item => ({
        ...item,
        month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      }));
    }
  });

  // Fetch revenue by plan
  const { data: planRevenueData, isLoading: planRevenueLoading } = useQuery({
    queryKey: ['revenue-by-plan', startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select(`
          amount, 
          subscription_plans!inner(
            id, 
            title, 
            subscription_period
          )
        `)
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate)
        .eq('status', 'completed');

      if (error) throw error;

      // Aggregate by plan
      const planRevenue: Record<string, { planId: string, title: string, period: string, revenue: number, count: number }> = {};
      
      data.forEach(transaction => {
        const planId = transaction.subscription_plans.id;
        if (!planRevenue[planId]) {
          planRevenue[planId] = { 
            planId, 
            title: transaction.subscription_plans.title,
            period: transaction.subscription_plans.subscription_period,
            revenue: 0,
            count: 0
          };
        }
        planRevenue[planId].revenue += Number(transaction.amount) || 0;
        planRevenue[planId].count++;
      });

      return Object.values(planRevenue).sort((a, b) => b.revenue - a.revenue);
    }
  });

  // Fetch outstanding payments
  const { data: outstandingPayments, isLoading: outstandingLoading } = useQuery({
    queryKey: ['outstanding-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_subscriptions')
        .select(`
          id,
          student_id,
          subscription_plan_id,
          next_due_date,
          payment_status,
          students!inner(name, email),
          subscription_plans!inner(title, standard_price)
        `)
        .eq('payment_status', 'unpaid')
        .gt('next_due_date', new Date().toISOString());

      if (error) throw error;

      const totalOutstanding = data.reduce((sum, item) => {
        return sum + Number(item.subscription_plans.standard_price || 0);
      }, 0);

      return {
        outstandingItems: data,
        totalOutstanding,
        countOutstanding: data.length
      };
    }
  });

  // Fetch payment method statistics
  const { data: paymentMethodStats, isLoading: paymentMethodsLoading } = useQuery({
    queryKey: ['payment-methods-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('paypal_transaction_id, amount')
        .eq('status', 'completed');

      if (error) throw error;

      const paypalCount = data.filter(t => t.paypal_transaction_id).length;
      const manualCount = data.filter(t => !t.paypal_transaction_id).length;
      const totalCount = data.length;
      
      const paypalAmount = data
        .filter(t => t.paypal_transaction_id)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      
      const manualAmount = data
        .filter(t => !t.paypal_transaction_id)
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      
      const totalAmount = data.reduce((sum, t) => sum + Number(t.amount || 0), 0);

      return [
        { 
          name: 'PayPal', 
          count: paypalCount, 
          percentage: totalCount > 0 ? (paypalCount / totalCount) * 100 : 0,
          amount: paypalAmount,
          amountPercentage: totalAmount > 0 ? (paypalAmount / totalAmount) * 100 : 0,
          color: '#1890ff' 
        },
        { 
          name: 'Manual Payment', 
          count: manualCount, 
          percentage: totalCount > 0 ? (manualCount / totalCount) * 100 : 0,
          amount: manualAmount,
          amountPercentage: totalAmount > 0 ? (manualAmount / totalAmount) * 100 : 0,
          color: '#52c41a' 
        }
      ];
    }
  });

  return {
    revenueData,
    planRevenueData,
    outstandingPayments,
    paymentMethodStats,
    isLoading: revenueLoading || planRevenueLoading || outstandingLoading || paymentMethodsLoading
  };
};
