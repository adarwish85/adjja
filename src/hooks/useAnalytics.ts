
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAnalytics = () => {
  // Students Analytics
  const { data: studentsData } = useQuery({
    queryKey: ['analytics-students'],
    queryFn: async () => {
      const { data: students } = await supabase
        .from('students')
        .select('*');

      const { data: studentsThisMonth } = await supabase
        .from('students')
        .select('*')
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      const totalStudents = students?.length || 0;
      const newThisMonth = studentsThisMonth?.length || 0;
      const activeStudents = students?.filter(s => s.status === 'active').length || 0;
      
      return {
        total: totalStudents,
        newThisMonth,
        active: activeStudents,
        averageAttendance: students?.reduce((acc, s) => acc + s.attendance_rate, 0) / totalStudents || 0
      };
    }
  });

  // Classes Analytics
  const { data: classesData } = useQuery({
    queryKey: ['analytics-classes'],
    queryFn: async () => {
      const { data: classes } = await supabase
        .from('classes')
        .select('*');

      const activeClasses = classes?.filter(c => c.status === 'Active').length || 0;
      const totalCapacity = classes?.reduce((acc, c) => acc + c.capacity, 0) || 0;
      const totalEnrolled = classes?.reduce((acc, c) => acc + c.enrolled, 0) || 0;
      const utilizationRate = totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0;

      return {
        active: activeClasses,
        total: classes?.length || 0,
        utilization: utilizationRate,
        averageSize: totalEnrolled / activeClasses || 0
      };
    }
  });

  // Revenue Analytics
  const { data: revenueData } = useQuery({
    queryKey: ['analytics-revenue'],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'paid');

      const { data: subscriptions } = await supabase
        .from('subscribers')
        .select('*')
        .eq('subscribed', true);

      const totalRevenue = orders?.reduce((acc, order) => acc + order.amount, 0) || 0;
      const monthlyRevenue = subscriptions?.reduce((acc, sub) => {
        const tierAmount = sub.subscription_tier === 'Basic' ? 1999 : 
                          sub.subscription_tier === 'Premium' ? 4999 : 9999;
        return acc + tierAmount;
      }, 0) || 0;

      const currentMonth = new Date().getMonth();
      const thisMonthOrders = orders?.filter(order => 
        new Date(order.created_at).getMonth() === currentMonth
      ) || [];
      
      const thisMonthRevenue = thisMonthOrders.reduce((acc, order) => acc + order.amount, 0);

      return {
        total: totalRevenue / 100, // Convert from cents
        monthly: monthlyRevenue / 100,
        thisMonth: thisMonthRevenue / 100,
        activeSubscriptions: subscriptions?.length || 0
      };
    }
  });

  // Enrollment Trends (mock data for now, can be enhanced with real data)
  const { data: enrollmentTrends } = useQuery({
    queryKey: ['analytics-enrollment-trends'],
    queryFn: async () => {
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trends = [];

      for (let i = 0; i < 6; i++) {
        const monthStart = new Date(2024, 6 + i, 1);
        const monthEnd = new Date(2024, 7 + i, 0);

        const { data: newStudents } = await supabase
          .from('students')
          .select('*')
          .gte('created_at', monthStart.toISOString())
          .lt('created_at', monthEnd.toISOString());

        trends.push({
          month: months[i],
          new: newStudents?.length || Math.floor(Math.random() * 50) + 150,
          dropouts: Math.floor(Math.random() * 20) + 10,
          net: (newStudents?.length || 180) - (Math.floor(Math.random() * 20) + 10)
        });
      }

      return trends;
    }
  });

  return {
    students: studentsData,
    classes: classesData,
    revenue: revenueData,
    enrollmentTrends,
    isLoading: !studentsData || !classesData || !revenueData
  };
};
