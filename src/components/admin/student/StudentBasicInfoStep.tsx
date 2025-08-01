
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StudentBasicInfoStepProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    joined_date: string;
  };
  updateFormData: (updates: any) => void;
}

export const StudentBasicInfoStep = ({ formData, updateFormData }: StudentBasicInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter full name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="Enter email address"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="joined_date">Join Date *</Label>
          <Input
            id="joined_date"
            type="date"
            value={formData.joined_date}
            onChange={(e) => updateFormData({ joined_date: e.target.value })}
            required
          />
        </div>
      </div>
    </div>
  );
};
