
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCoachBasicInfoProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    joined_date: string;
  };
  setFormData: (updater: (prev: any) => any) => void;
}

export const AddCoachBasicInfo = ({ formData, setFormData }: AddCoachBasicInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter coach's full name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="coach@adjja.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="joinedDate">Join Date</Label>
        <Input
          id="joinedDate"
          type="date"
          value={formData.joined_date}
          onChange={(e) => setFormData(prev => ({ ...prev, joined_date: e.target.value }))}
        />
      </div>
    </div>
  );
};
