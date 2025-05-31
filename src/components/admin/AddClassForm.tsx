
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Class } from "@/hooks/useClasses";
import { useCoaches } from "@/hooks/useCoaches";
import { ScheduleSelector } from "./ScheduleSelector";

interface AddClassFormProps {
  classItem?: Class;
  onSubmit: (classData: Class | Omit<Class, "id" | "created_at" | "updated_at">) => void;
  onClose: () => void;
  isEditing?: boolean;
}

const levels = ["Beginner", "Intermediate", "Advanced", "Kids", "All Levels"];
const statusOptions = ["Active", "Inactive", "Cancelled"];
const locations = ["Mat 1", "Mat 2", "Both Mats", "Outdoor Area"];

export const AddClassForm = ({ classItem, onSubmit, onClose, isEditing = false }: AddClassFormProps) => {
  const { coaches, loading: coachesLoading } = useCoaches();
  const [formData, setFormData] = useState({
    name: classItem?.name || "",
    instructor: classItem?.instructor || "",
    schedule: classItem?.schedule || "",
    duration: classItem?.duration || 60,
    capacity: classItem?.capacity || 20,
    level: classItem?.level || "Beginner" as const,
    location: classItem?.location || "",
    status: classItem?.status || "Active" as const,
    description: classItem?.description || "",
  });

  // Get active coaches for the dropdown
  const activeCoaches = coaches.filter(coach => coach.status === "active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission data:", formData);
    
    if (isEditing && classItem) {
      onSubmit({
        ...classItem,
        ...formData,
      });
    } else {
      const newClass: Omit<Class, "id" | "created_at" | "updated_at"> = {
        name: formData.name,
        instructor: formData.instructor,
        schedule: formData.schedule,
        duration: formData.duration,
        capacity: formData.capacity,
        enrolled: 0, // Default to 0 for new classes
        level: formData.level,
        location: formData.location,
        status: formData.status,
        description: formData.description || undefined,
      };
      
      console.log("Submitting new class:", newClass);
      onSubmit(newClass);
    }
    onClose();
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Class Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter class name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Select
            value={formData.instructor}
            onValueChange={(value) => handleChange("instructor", value)}
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

      <div className="space-y-2">
        <Label>Schedule</Label>
        <ScheduleSelector
          value={formData.schedule}
          onChange={(value) => handleChange("schedule", value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="15"
            max="180"
            value={formData.duration}
            onChange={(e) => handleChange("duration", parseInt(e.target.value) || 60)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            max="50"
            value={formData.capacity}
            onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 20)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => handleChange("level", value)}
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
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => handleChange("location", value)}
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
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
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
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter class description (optional)"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
          {isEditing ? "Update Class" : "Add Class"}
        </Button>
      </div>
    </form>
  );
};
