
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoachBasicInfoStepProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    joined_date: string;
  };
  updateFormData: (updates: any) => void;
}

export const CoachBasicInfoStep = ({ formData, updateFormData }: CoachBasicInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter coach's full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="coach@adjja.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="joinedDate">Join Date</Label>
          <Input
            id="joinedDate"
            type="date"
            value={formData.joined_date}
            onChange={(e) => updateFormData({ joined_date: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
