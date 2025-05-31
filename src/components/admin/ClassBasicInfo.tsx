
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCoaches } from "@/hooks/useCoaches";

interface ClassBasicInfoProps {
  formData: {
    name: string;
    instructor: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export const ClassBasicInfo = ({ formData, onUpdate }: ClassBasicInfoProps) => {
  const { coaches, loading: coachesLoading } = useCoaches();
  const activeCoaches = coaches.filter(coach => coach.status === "active");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Class Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onUpdate("name", e.target.value)}
          placeholder="Enter class name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instructor">Instructor *</Label>
        <Select
          value={formData.instructor}
          onValueChange={(value) => onUpdate("instructor", value)}
          required
          disabled={coachesLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder={coachesLoading ? "Loading instructors..." : "Select instructor"} />
          </SelectTrigger>
          <SelectContent>
            {activeCoaches.map((coach) => (
              <SelectItem key={coach.id} value={coach.name}>
                {coach.name}
              </SelectItem>
            ))}
            <SelectItem value="Various">Various</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
