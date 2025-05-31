
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranches } from "@/hooks/useBranches";

interface ClassDetailsStepProps {
  formData: {
    capacity: number;
    level: string;
    location: string;
    status: string;
    description: string;
  };
  onUpdate: (field: string, value: string | number) => void;
}

const levels = ["Beginner", "Intermediate", "Advanced", "Kids", "All Levels"];
const statusOptions = ["Active", "Inactive", "Cancelled"];

export const ClassDetailsStep = ({ formData, onUpdate }: ClassDetailsStepProps) => {
  const { branches, isLoading: branchesLoading } = useBranches();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Class Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            max="50"
            value={formData.capacity}
            onChange={(e) => onUpdate("capacity", parseInt(e.target.value) || 20)}
            placeholder="Maximum students"
            required
          />
          <p className="text-xs text-gray-500">Maximum number of students allowed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Class Level</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => onUpdate("level", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Skill level required for this class</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Branch Location</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => onUpdate("location", value)}
            required
            disabled={branchesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={branchesLoading ? "Loading branches..." : "Select branch"} />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.name}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Which branch will host this class</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Class Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => onUpdate("status", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">Current status of the class</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Class Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Describe what students will learn in this class..."
          rows={3}
        />
        <p className="text-xs text-gray-500">Optional description for students</p>
      </div>
    </div>
  );
};
