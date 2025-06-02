
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
import { useSettings } from "@/hooks/useSettings";

interface CoachProfessionalInfoStepProps {
  formData: {
    belt: string;
    specialties: string[];
    status: "active" | "inactive";
    students_count: number;
  };
  updateFormData: (updates: any) => void;
}

const belts = ["White Belt", "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt"];

export const CoachProfessionalInfoStep = ({ formData, updateFormData }: CoachProfessionalInfoStepProps) => {
  const { loadGeneralSettings } = useSettings();
  const settings = loadGeneralSettings();
  const availableSpecialties = settings.specialties || [];

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      updateFormData({
        specialties: [...formData.specialties, specialty]
      });
    } else {
      updateFormData({
        specialties: formData.specialties.filter(s => s !== specialty)
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="belt">Belt Rank *</Label>
          <Select value={formData.belt} onValueChange={(value) => updateFormData({ belt: value })}>
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
          <Select value={formData.status} onValueChange={(value: "active" | "inactive") => updateFormData({ status: value })}>
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

      <div className="space-y-2">
        <Label htmlFor="studentsCount">Current Students</Label>
        <Input
          id="studentsCount"
          type="number"
          min="0"
          value={formData.students_count}
          onChange={(e) => updateFormData({ students_count: parseInt(e.target.value) || 0 })}
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <Label>Specialties</Label>
        {availableSpecialties.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No specialties configured. Go to Settings → General to add specialties.
          </p>
        ) : (
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
        )}
      </div>
    </div>
  );
};
