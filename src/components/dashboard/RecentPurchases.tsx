
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface PurchaseData {
  id: string;
  student_name: string;
  course_title: string;
  amount: number;
  enrollment_date: string;
  status: string;
}

const useRecentPurchases = () => {
  return useQuery({
    queryKey: ['recent-purchases'],
    queryFn: async (): Promise<PurchaseData[]> => {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          id,
          enrollment_date,
          status,
          students!inner(name),
          courses!inner(title, price)
        `)
        .order('enrollment_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map(enrollment => ({
        id: enrollment.id,
        student_name: (enrollment as any).students?.name || 'Unknown Student',
        course_title: (enrollment as any).courses?.title || 'Unknown Course',
        amount: (enrollment as any).courses?.price || 0,
        enrollment_date: enrollment.enrollment_date,
        status: enrollment.status || 'Active',
      }));
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};

export const RecentPurchases = () => {
  const { data: purchases, isLoading } = useRecentPurchases();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Recent Course Enrollments
        </CardTitle>
        <p className="text-sm text-bjj-gray">Latest course purchases and enrollments</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-red"></div>
          </div>
        ) : purchases && purchases.length > 0 ? (
          <div className="space-y-4 max-h-[200px] overflow-y-auto">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-semibold text-bjj-navy">{purchase.student_name}</h4>
                  <p className="text-sm text-bjj-gray">{purchase.course_title}</p>
                  <p className="text-xs text-bjj-gray">
                    {format(new Date(purchase.enrollment_date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-bjj-navy font-semibold">
                    <DollarSign className="h-3 w-3" />
                    {purchase.amount.toFixed(2)}
                  </div>
                  <Badge 
                    variant={purchase.status === 'Active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {purchase.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-bjj-gray">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No purchases yet</p>
            <p className="text-xs">Course purchases will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
