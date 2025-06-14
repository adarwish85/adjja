
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export const RecentPurchases = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy">Recent LMS Purchases</CardTitle>
        <p className="text-sm text-bjj-gray">Latest course purchases and enrollments</p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-bjj-gray">
          <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No purchases yet</p>
          <p className="text-xs">Course purchases will appear here</p>
        </div>
      </CardContent>
    </Card>
  );
};
