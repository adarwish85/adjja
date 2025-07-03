
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, UserCheck, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ManualCheckInModal } from "@/components/attendance/ManualCheckInModal";
import { ManualPaymentForm } from "@/components/admin/payments/ManualPaymentForm";

const quickActions = [
  {
    title: "Add Coach",
    description: "Register a new coach",
    icon: Users,
    color: "bg-blue-500 hover:bg-blue-600",
    route: "/admin/coaches",
    type: "navigation" as const,
  },
  {
    title: "Check In Student",
    description: "Mark student attendance",
    icon: UserCheck,
    color: "bg-green-500 hover:bg-green-600",
    type: "modal" as const,
    modalType: "checkin" as const,
  },
  {
    title: "Record Payments",
    description: "Log student payments",
    icon: DollarSign,
    color: "bg-purple-500 hover:bg-purple-600",
    type: "modal" as const,
    modalType: "payment" as const,
  },
  {
    title: "Add Student",
    description: "Enroll new student",
    icon: Plus,
    color: "bg-orange-500 hover:bg-orange-600",
    route: "/admin/students",
    type: "navigation" as const,
  },
];

export const AdminTools = () => {
  const navigate = useNavigate();
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleActionClick = (action: typeof quickActions[0]) => {
    if (action.type === "navigation" && action.route) {
      navigate(action.route);
    } else if (action.type === "modal") {
      if (action.modalType === "checkin") {
        setShowCheckInModal(true);
      } else if (action.modalType === "payment") {
        setShowPaymentModal(true);
      }
    }
  };

  const handleAttendanceMarked = () => {
    // Refresh dashboard data or show success notification
    console.log("Attendance marked successfully");
  };

  const handlePaymentRecorded = () => {
    // Refresh dashboard data or show success notification
    console.log("Payment recorded successfully");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Quick Actions</CardTitle>
          <p className="text-sm text-bjj-gray">Common administrative tasks</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
                onClick={() => handleActionClick(action)}
              >
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-bjj-navy text-sm">{action.title}</div>
                  <div className="text-xs text-bjj-gray">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <ManualCheckInModal 
        open={showCheckInModal}
        onOpenChange={setShowCheckInModal}
        onAttendanceMarked={handleAttendanceMarked}
      />

      <ManualPaymentForm
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onPaymentRecorded={handlePaymentRecorded}
      />
    </>
  );
};
