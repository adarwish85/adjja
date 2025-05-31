
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

const levels = ["Beginner", "Intermediate", "Advanced", "Kids", "All Levels"];
const statusOptions = ["Active", "Inactive", "Cancelled"];
const locations = ["Mat 1", "Mat 2", "Both Mats", "Outdoor Area"];

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

export const ClassDetailsStep = ({ formData, onUpdate }: ClassDetailsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            max="50"
            value={formData.capacity}
            onChange={(e) => onUpdate("capacity", parseInt(e.target.value) || 20)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level *</Label>
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
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => onUpdate("location", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
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
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Enter class description (optional)"
          rows={3}
        />
      </div>
    </div>
  );
};
