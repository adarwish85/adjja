
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";

interface StudentClassInfoStepProps {
  formData: {
    belt: string;
    stripes: number;
    status: "active" | "inactive" | "on-hold";
    membership_type: "monthly" | "yearly" | "unlimited";
    subscription_plan_id: string;
    plan_start_date: string;
    attendance_rate: number;
    last_attended: string;
  };
  updateFormData: (updates: any) => void;
  isEditing: boolean;
}

const belts = ["White Belt", "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt"];
const statusOptions = ["active", "inactive", "on-hold"];

export const StudentClassInfoStep = ({ formData, updateFormData, isEditing }: StudentClassInfoStepProps) => {
  const { activeSubscriptionPlans, isLoading: plansLoading } = useSubscriptionPlans();

  // Set default plan start date to today if not set
  const handlePlanStartDateChange = (date: string) => {
    updateFormData({ plan_start_date: date });
  };

  // When subscription plan changes, update both plan_id and reset start date if needed
  const handleSubscriptionPlanChange = (planId: string) => {
    updateFormData({ 
      subscription_plan_id: planId,
      // Set default start date to today if not already set
      plan_start_date: formData.plan_start_date || new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="belt">Belt Level *</Label>
          <Select
            value={formData.belt}
            onValueChange={(value) => updateFormData({ belt: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select belt" />
            </SelectTrigger>
            <SelectContent>
              {belts.map((belt) => (
                <SelectItem key={belt} value={belt}>
                  {belt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stripes">Stripes</Label>
          <Select
            value={formData.stripes.toString()}
            onValueChange={(value) => updateFormData({ stripes: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Stripes" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4].map((stripe) => (
                <SelectItem key={stripe} value={stripe.toString()}>
                  {stripe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subscription_plan">Subscription Plan *</Label>
          <Select
            value={formData.subscription_plan_id}
            onValueChange={handleSubscriptionPlanChange}
            required
            disabled={plansLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={plansLoading ? "Loading plans..." : "Select subscription plan"} />
            </SelectTrigger>
            <SelectContent>
              {activeSubscriptionPlans?.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.title} - ${plan.sale_price || plan.standard_price}/{plan.subscription_period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="plan_start_date">Plan Start Date *</Label>
          <Input
            id="plan_start_date"
            type="date"
            value={formData.plan_start_date || new Date().toISOString().split('T')[0]}
            onChange={(e) => handlePlanStartDateChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => updateFormData({ status: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isEditing && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="attendance_rate">Attendance Rate (%)</Label>
            <Input
              id="attendance_rate"
              type="number"
              min="0"
              max="100"
              value={formData.attendance_rate}
              onChange={(e) => updateFormData({ attendance_rate: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_attended">Last Attended</Label>
            <Input
              id="last_attended"
              type="date"
              value={formData.last_attended}
              onChange={(e) => updateFormData({ last_attended: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
};
