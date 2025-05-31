
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

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

interface AddCoachProfessionalInfoProps {
  formData: {
    branch: string;
    belt: string;
    specialties: string[];
    status: "active" | "inactive";
    students_count: number;
  };
  setFormData: (updater: (prev: any) => any) => void;
  handleSpecialtyChange: (specialty: string, checked: boolean) => void;
}

export const AddCoachProfessionalInfo = ({ 
  formData, 
  setFormData, 
  handleSpecialtyChange 
}: AddCoachProfessionalInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};
