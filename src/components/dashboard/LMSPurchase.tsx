
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export const LMSPurchase = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-bjj-gold" />
          LMS Store
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Featured Content */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Featured Courses</h4>
          <div className="text-center py-4 text-bjj-gray">
            <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No courses available yet</p>
            <p className="text-xs">New courses will appear here when published</p>
          </div>
        </div>

        {/* Subscriptions */}
        <div>
          <h4 className="font-semibold text-bjj-navy mb-3">Subscriptions</h4>
          <div className="text-center py-4 text-bjj-gray">
            <p className="text-sm">No subscription plans available</p>
            <p className="text-xs">Subscription options will appear here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
