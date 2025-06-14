
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { StudentPaymentInterface } from "@/components/admin/payments/StudentPaymentInterface";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const StudentPayments = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <StudentLayout>
        <div className="p-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Please log in to access payment options.</p>
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-8 w-8 text-bjj-gold" />
            <h1 className="text-3xl font-bold text-bjj-navy">Membership Plans</h1>
          </div>
          
          <StudentPaymentInterface studentId={user.id} />
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentPayments;
