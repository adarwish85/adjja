
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Coach } from "@/hooks/useCoaches";

interface AddCoachFormProps {
  coach?: Coach;
  onSubmit: (coach: Omit<Coach, "id" | "created_at" | "updated_at">) => void;
  isEditing?: boolean;
}

const branches = ["Downtown", "Westside", "North Valley", "East Side"];
const belts = ["White Belt", "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt"];
const availableSpecialties = [
  "Fundamentals",
  "Competition",
  "No-Gi",
  "Kids Classes",
  "Women's Classes",
  "Self Defense",
  "Advanced Techniques",
  "Wrestling",
  "MMA"
];

export const AddCoachForm = ({ coach, onSubmit, isEditing = false }: AddCoachFormProps) => {
  const [formData, setFormData] = useState({
    name: coach?.name || "",
    email: coach?.email || "",
    phone: coach?.phone || "",
    branch: coach?.branch || "",
    belt: coach?.belt || "",
    specialties: coach?.specialties || [],
    status: coach?.status || "active" as const,
    students_count: coach?.students_count || 0,
    joined_date: coach?.joined_date || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.branch || !formData.belt) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSubmit(formData);
    
    if (!isEditing) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        branch: "",
        belt: "",
        specialties: [],
        status: "active",
        students_count: 0,
        joined_date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.filter(s => s !== specialty)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          <Label htmlFor="branch">Branch *</Label>
          <Select value={formData.branch} onValueChange={(value) => setFormData(prev => ({ ...prev, branch: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="belt">Belt Rank *</Label>
          <Select value={formData.belt} onValueChange={(value) => setFormData(prev => ({ ...prev, belt: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select belt rank" />
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
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData(prev => ({ ...prev, status: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentsCount">Current Students</Label>
          <Input
            id="studentsCount"
            type="number"
            min="0"
            value={formData.students_count}
            onChange={(e) => setFormData(prev => ({ ...prev, students_count: parseInt(e.target.value) || 0 }))}
            placeholder="0"
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

      <div className="space-y-2">
        <Label>Specialties</Label>
        <div className="grid grid-cols-3 gap-2">
          {availableSpecialties.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox
                id={specialty}
                checked={formData.specialties.includes(specialty)}
                onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
              />
              <Label htmlFor={specialty} className="text-sm">
                {specialty}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
          {isEditing ? "Update Coach" : "Add Coach"}
        </Button>
      </div>
    </form>
  );
};
