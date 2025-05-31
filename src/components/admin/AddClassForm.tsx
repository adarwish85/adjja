
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
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AddClassFormProps {
  onClose: () => void;
}

const mockInstructors = [
  { id: 1, name: "Professor Silva" },
  { id: 2, name: "Coach Martinez" },
  { id: 3, name: "Coach Anderson" },
  { id: 4, name: "Coach Johnson" },
];

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export const AddClassForm = ({ onClose }: AddClassFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructor: "",
    level: "",
    capacity: "",
    duration: "",
    location: "",
    startTime: "",
    selectedDays: [] as string[],
  });

  const handleDayToggle = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter(id => id !== dayId)
        : [...prev.selectedDays, dayId]
    }));
  };

  const removeDayFromSelection = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.filter(id => id !== dayId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
    onClose();
  };

  const getDayLabel = (dayId: string) => {
    return daysOfWeek.find(day => day.id === dayId)?.label || dayId;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Class Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Morning Fundamentals"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor *</Label>
          <Select value={formData.instructor} onValueChange={(value) => setFormData(prev => ({ ...prev, instructor: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              {mockInstructors.map((instructor) => (
                <SelectItem key={instructor.id} value={instructor.name}>
                  {instructor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level *</Label>
          <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="kids">Kids</SelectItem>
              <SelectItem value="all-levels">All Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity *</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
            placeholder="20"
            min="1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
            placeholder="60"
            min="15"
            step="15"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mat-1">Mat 1</SelectItem>
              <SelectItem value="mat-2">Mat 2</SelectItem>
              <SelectItem value="both-mats">Both Mats</SelectItem>
              <SelectItem value="main-area">Main Area</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of the class..."
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <Label>Schedule Days *</Label>
        <Card>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {daysOfWeek.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.id}
                    checked={formData.selectedDays.includes(day.id)}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <Label htmlFor={day.id} className="text-sm font-normal">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
            
            {formData.selectedDays.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Label className="text-sm text-bjj-gray mb-2 block">Selected Days:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedDays.map((dayId) => (
                    <Badge key={dayId} variant="secondary" className="flex items-center gap-1">
                      {getDayLabel(dayId)}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-red-600"
                        onClick={() => removeDayFromSelection(dayId)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
          disabled={!formData.name || !formData.instructor || !formData.level || !formData.capacity || !formData.duration || !formData.location || !formData.startTime || formData.selectedDays.length === 0}
        >
          Create Class
        </Button>
      </div>
    </form>
  );
};
