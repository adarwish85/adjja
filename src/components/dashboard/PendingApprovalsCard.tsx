
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ArrowRight } from "lucide-react";
import { usePendingApprovals } from "@/hooks/usePendingApprovals";
import { useNavigate } from "react-router-dom";

export const PendingApprovalsCard = () => {
  const { pendingUsers, isLoading } = usePendingApprovals();
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/admin/approvals');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-bjj-gray">
          Pending Approvals
        </CardTitle>
        <div className="p-2 rounded-full bg-orange-100">
          <Clock className="h-4 w-4 text-orange-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-bjj-navy">
              {isLoading ? '--' : pendingUsers.length}
            </div>
            {pendingUsers.length > 0 && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Needs Review
              </Badge>
            )}
          </div>
          
          <p className="text-xs text-bjj-gray">
            {isLoading ? 'Loading...' : 
             pendingUsers.length === 0 ? 'No pending approvals' :
             `${pendingUsers.length} user${pendingUsers.length > 1 ? 's' : ''} awaiting approval`}
          </p>

          {pendingUsers.length > 0 && (
            <div className="pt-2">
              <Button 
                onClick={handleViewAll}
                variant="outline" 
                size="sm"
                className="w-full"
              >
                <Users className="h-3 w-3 mr-2" />
                Review Pending Users
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
