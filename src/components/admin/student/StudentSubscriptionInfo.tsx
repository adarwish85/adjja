
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentStatusBadge } from "@/components/ui/payment-status-badge";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { Student } from "@/hooks/useStudents";
import { Calendar, CreditCard, Clock, DollarSign } from "lucide-react";

interface StudentSubscriptionInfoProps {
  student: Student;
}

export const StudentSubscriptionInfo = ({ student }: StudentSubscriptionInfoProps) => {
  const { subscriptionPlans } = useSubscriptionPlans();
  
  const assignedPlan = subscriptionPlans?.find(plan => plan.id === student.subscription_plan_id);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDaysUntilDue = (dueDateString: string | null) => {
    if (!dueDateString) return null;
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = calculateDaysUntilDue(student.next_due_date);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Subscription Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Subscription Plan</span>
            </div>
            <div className="ml-6">
              {assignedPlan ? (
                <div>
                  <p className="font-semibold">{assignedPlan.title}</p>
                  <p className="text-sm text-gray-600">
                    ${assignedPlan.sale_price || assignedPlan.standard_price}/{assignedPlan.subscription_period}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {assignedPlan.number_of_classes} classes
                  </Badge>
                </div>
              ) : (
                <p className="text-gray-500">No plan assigned</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Plan Start Date</span>
            </div>
            <div className="ml-6">
              <p>{formatDate(student.plan_start_date)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Next Payment Due</span>
            </div>
            <div className="ml-6">
              <p>{formatDate(student.next_due_date)}</p>
              {daysUntilDue !== null && (
                <p className="text-sm text-gray-600">
                  {daysUntilDue > 0 
                    ? `${daysUntilDue} days remaining`
                    : daysUntilDue === 0 
                    ? "Due today"
                    : `${Math.abs(daysUntilDue)} days overdue`
                  }
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Payment Status</span>
            </div>
            <div>
              <PaymentStatusBadge status={student.payment_status} />
            </div>
          </div>
        </div>

        {student.last_attended && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Last Payment Date</span>
            </div>
            <div className="ml-6">
              <p>{formatDate(student.last_attended)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
