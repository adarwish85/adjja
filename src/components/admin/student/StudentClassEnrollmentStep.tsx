
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClasses } from "@/hooks/useClasses";
import { Plus, X } from "lucide-react";

interface StudentClassEnrollmentStepProps {
  formData: {
    selectedClassIds: string[];
  };
  updateFormData: (updates: any) => void;
}

export const StudentClassEnrollmentStep = ({ formData, updateFormData }: StudentClassEnrollmentStepProps) => {
  const { classes } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  
  // Filter classes to show only active ones
  const activeClasses = classes.filter(cls => cls.status === "Active");
  
  // Get classes that are not already selected
  const availableClasses = activeClasses.filter(
    cls => !formData.selectedClassIds.includes(cls.id)
  );

  const handleAddClass = () => {
    if (!selectedClassId) return;
    
    const updatedClassIds = [...formData.selectedClassIds, selectedClassId];
    updateFormData({ selectedClassIds: updatedClassIds });
    setSelectedClassId("");
  };

  const handleRemoveClass = (classId: string) => {
    const updatedClassIds = formData.selectedClassIds.filter(id => id !== classId);
    updateFormData({ selectedClassIds: updatedClassIds });
  };

  const getSelectedClasses = () => {
    return activeClasses.filter(cls => formData.selectedClassIds.includes(cls.id));
  };

  return (
    <div className="space-y-4">
      {/* Current Class Enrollments */}
      <div>
        <h4 className="font-medium mb-2">Selected Classes</h4>
        {formData.selectedClassIds.length > 0 ? (
          <div className="space-y-2">
            {getSelectedClasses().map((classInfo) => (
              <div key={classInfo.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{classInfo.name}</div>
                  <div className="text-sm text-gray-600">
                    {classInfo.instructor} • {classInfo.schedule}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {classInfo.level}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveClass(classInfo.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No classes selected</p>
        )}
      </div>

      {/* Add New Class */}
      {availableClasses.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Add Class</h4>
          <div className="flex gap-2">
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {availableClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.instructor} ({cls.schedule})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAddClass}
              disabled={!selectedClassId}
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      )}

      {availableClasses.length === 0 && formData.selectedClassIds.length > 0 && (
        <p className="text-gray-500 text-sm">All available classes have been selected</p>
      )}
    </div>
  );
};
