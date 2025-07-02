
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentPaymentHistory } from "../payments/StudentPaymentHistory";
import { ManualPaymentButton } from "../payments/ManualPaymentButton";
import { PaymentStatusBadge } from "@/components/ui/payment-status-badge";
import { DollarSign, Calendar, CreditCard } from "lucide-react";
import { Student } from "@/hooks/useStudents";

interface StudentPaymentSectionProps {
  student: Student;
}

export const StudentPaymentSection = ({ student }: StudentPaymentSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Payment Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Payment Status</p>
              <PaymentStatusBadge status={student.payment_status} />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Membership Type</p>
              <Badge variant="outline">{student.membership_type}</Badge>
            </div>
            {student.next_due_date && (
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Next Due Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {new Date(student.next_due_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <ManualPaymentButton 
              studentId={student.id}
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <StudentPaymentHistory 
        studentId={student.id} 
        studentName={student.name}
      />
    </div>
  );
};
