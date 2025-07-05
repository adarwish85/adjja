
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePendingApprovals } from "@/hooks/usePendingApprovals";

export const PendingApprovalsCard = () => {
  const navigate = useNavigate();
  const { pendingUsers, isLoading } = usePendingApprovals();

  const pendingCount = pendingUsers?.length || 0;

  const handleViewApprovals = () => {
    navigate("/admin/approvals");
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-bjj-gray">
          Pending Approvals
        </CardTitle>
        <div className="p-2 rounded-full bg-orange-100">
          {pendingCount > 0 ? (
            <AlertCircle className="h-4 w-4 text-orange-600" />
          ) : (
            <Clock className="h-4 w-4 text-orange-600" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-bjj-navy">
          {isLoading ? "..." : pendingCount}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-bjj-gray">
            {pendingCount === 0 ? "All caught up!" : "Users awaiting approval"}
          </p>
          {pendingCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewApprovals}
              className="text-xs"
            >
              Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
