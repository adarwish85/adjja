
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, DollarSign } from "lucide-react";
import { useStudents } from "@/hooks/useStudents";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { usePayPalPayments } from "@/hooks/usePayPalPayments";

interface ManualPaymentFormProps {
  onClose: () => void;
  preselectedStudentId?: string;
}

export const ManualPaymentForm = ({ onClose, preselectedStudentId }: ManualPaymentFormProps) => {
  const [formData, setFormData] = useState({
    studentId: preselectedStudentId || "",
    planId: "",
    amount: "",
    notes: "",
  });

  const { students } = useStudents();
  const { activeSubscriptionPlans } = useSubscriptionPlans();
  const { recordManualPayment, isLoading } = usePayPalPayments();

  const selectedPlan = activeSubscriptionPlans?.find(p => p.id === formData.planId);

  const handlePlanChange = (planId: string) => {
    const plan = activeSubscriptionPlans?.find(p => p.id === planId);
    setFormData({
      ...formData,
      planId,
      amount: plan ? (plan.sale_price || plan.standard_price).toString() : formData.amount,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await recordManualPayment(
        formData.studentId,
        parseFloat(formData.amount),
        formData.planId || undefined
      );
      onClose();
    } catch (error) {
      console.error("Error recording manual payment:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Record Manual Payment
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select 
                value={formData.studentId} 
                onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                required
                disabled={!!preselectedStudentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan (Optional)</Label>
              <Select 
                value={formData.planId} 
                onValueChange={handlePlanChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan or leave empty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific plan</SelectItem>
                  {activeSubscriptionPlans?.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.title} - ${(plan.sale_price || plan.standard_price).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPlan && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-bjj-navy">{selectedPlan.title}</h4>
              <p className="text-sm text-bjj-gray">{selectedPlan.description}</p>
              <p className="text-sm">
                <span className="text-bjj-gray">Classes:</span> {selectedPlan.number_of_classes === 999 ? "Unlimited" : selectedPlan.number_of_classes}
              </p>
              <p className="text-sm">
                <span className="text-bjj-gray">Period:</span> {selectedPlan.subscription_period}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter payment amount"
              required
              min="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this payment..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Button
              type="submit"
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
              disabled={isLoading}
            >
              {isLoading ? "Recording..." : "Record Payment"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
