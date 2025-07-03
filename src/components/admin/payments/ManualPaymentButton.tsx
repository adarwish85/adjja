
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { ManualPaymentForm } from "./ManualPaymentForm";

interface ManualPaymentButtonProps {
  studentId?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export const ManualPaymentButton = ({ 
  studentId, 
  variant = "default", 
  size = "default",
  className 
}: ManualPaymentButtonProps) => {
  const [showForm, setShowForm] = useState(false);

  const handlePaymentRecorded = () => {
    // Handle successful payment recording
    console.log("Payment recorded successfully");
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setShowForm(true)}
      >
        <DollarSign className="h-4 w-4 mr-2" />
        Record Payment
      </Button>

      <ManualPaymentForm
        open={showForm}
        onOpenChange={setShowForm}
        onPaymentRecorded={handlePaymentRecorded}
      />
    </>
  );
};
