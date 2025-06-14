
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCoaches } from "@/hooks/useCoaches";

interface StudentClassInfoStepProps {
  formData: {
    belt: string;
    stripes: number;
    coach: string;
    status: "active" | "inactive" | "on-hold";
    membership_type: "monthly" | "yearly" | "unlimited";
    attendance_rate: number;
    last_attended: string;
  };
  updateFormData: (updates: any) => void;
  isEditing: boolean;
}

const belts = ["White Belt", "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt"];
const membershipTypes = ["monthly", "yearly", "unlimited"];
const statusOptions = ["active", "inactive", "on-hold"];

export const StudentClassInfoStep = ({ formData, updateFormData, isEditing }: StudentClassInfoStepProps) => {
  const { coaches, loading: coachesLoading } = useCoaches();
  const activeCoaches = coaches.filter(coach => coach.status === "active");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
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
        
        <div className="space-y-2">
          <Label htmlFor="coach">Assigned Coach *</Label>
          <Select
            value={formData.coach}
            onValueChange={(value) => updateFormData({ coach: value })}
            required
            disabled={coachesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={coachesLoading ? "Loading coaches..." : "Select coach"} />
            </SelectTrigger>
            <SelectContent>
              {activeCoaches.map((coach) => (
                <SelectItem key={coach.id} value={coach.name}>
                  {coach.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="membership_type">Membership Type *</Label>
          <Select
            value={formData.membership_type}
            onValueChange={(value) => updateFormData({ membership_type: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select membership" />
            </SelectTrigger>
            <SelectContent>
              {membershipTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
