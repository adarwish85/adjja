
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Building, CreditCard } from "lucide-react";
import { PendingApprovalsCard } from "./PendingApprovalsCard";

export const DashboardOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <PendingApprovalsCard />
      
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray">
            Total Active Students
          </CardTitle>
          <div className="p-2 rounded-full bg-blue-100">
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">No data available</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray">
            Number of Coaches
          </CardTitle>
          <div className="p-2 rounded-full bg-green-100">
            <Users className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">No data available</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray">
            Total Branches
          </CardTitle>
          <div className="p-2 rounded-full bg-purple-100">
            <Building className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">No data available</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-bjj-gray">
            Monthly LMS Revenue
          </CardTitle>
          <div className="p-2 rounded-full bg-yellow-100">
            <CreditCard className="h-4 w-4 text-bjj-gold-dark" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-bjj-navy">--</div>
          <p className="text-xs text-bjj-gray">No data available</p>
        </CardContent>
      </Card>
    </div>
  );
};
