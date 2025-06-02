
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useClasses } from "@/hooks/useClasses";
import { Loader2 } from "lucide-react";

interface CoachClassAssignmentStepProps {
  formData: {
    assigned_classes: string[];
  };
  updateFormData: (updates: any) => void;
}

export const CoachClassAssignmentStep = ({ formData, updateFormData }: CoachClassAssignmentStepProps) => {
  const { classes, loading } = useClasses();

  const handleClassChange = (className: string, checked: boolean) => {
    if (checked) {
      updateFormData({
        assigned_classes: [...formData.assigned_classes, className]
      });
    } else {
      updateFormData({
        assigned_classes: formData.assigned_classes.filter(c => c !== className)
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading classes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Assign Classes</Label>
        <p className="text-sm text-gray-600 mt-1">
          Select the classes this coach will be responsible for instructing.
        </p>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {classes.length === 0 ? (
          <p className="text-gray-500">No classes available. Create classes first to assign them to coaches.</p>
        ) : (
          classes.map((classItem) => (
            <div key={classItem.id} className="flex items-start space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={classItem.id}
                checked={formData.assigned_classes.includes(classItem.name)}
                onCheckedChange={(checked) => handleClassChange(classItem.name, checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor={classItem.id} className="font-medium cursor-pointer">
                  {classItem.name}
                </Label>
                <div className="text-sm text-gray-600 mt-1">
                  <div>{classItem.schedule} • {classItem.duration} minutes</div>
                  <div>{classItem.level} • {classItem.location}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {formData.assigned_classes.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <Label className="text-sm font-medium">Selected Classes ({formData.assigned_classes.length}):</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.assigned_classes.map((className) => (
              <span key={className} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {className}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
