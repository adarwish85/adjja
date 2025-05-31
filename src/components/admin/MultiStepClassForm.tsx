
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Class } from "@/hooks/useClasses";
import { ClassBasicInfo } from "./ClassBasicInfo";
import { ClassScheduleStep } from "./ClassScheduleStep";
import { ClassDetailsStep } from "./ClassDetailsStep";

interface MultiStepClassFormProps {
  classItem?: Class;
  onSubmit: (classData: Class | Omit<Class, "id" | "created_at" | "updated_at">) => void;
  onClose: () => void;
  isEditing?: boolean;
}

const steps = [
  { id: 1, title: "Basic Info", description: "Class name and instructor" },
  { id: 2, title: "Schedule", description: "Set class times" },
  { id: 3, title: "Details", description: "Capacity, level & location" },
];

export const MultiStepClassForm = ({ classItem, onSubmit, onClose, isEditing = false }: MultiStepClassFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: classItem?.name || "",
    instructor: classItem?.instructor || "",
    schedule: classItem?.schedule || "",
    capacity: classItem?.capacity || 20,
    level: classItem?.level || "Beginner" as const,
    location: classItem?.location || "",
    status: classItem?.status || "Active" as const,
    description: classItem?.description || "",
  });

  const calculateDuration = (schedule: string): number => {
    if (!schedule) return 60;
    
    const daySchedules = schedule.split(", ");
    if (daySchedules.length > 0) {
      const firstDay = daySchedules[0];
      const timeMatch = firstDay.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/);
      
      if (timeMatch) {
        const [, startHour, startMinute, startPeriod, endHour, endMinute, endPeriod] = timeMatch;
        
        let start24Hour = parseInt(startHour);
        let end24Hour = parseInt(endHour);
        
        if (startPeriod === "PM" && start24Hour !== 12) start24Hour += 12;
        if (startPeriod === "AM" && start24Hour === 12) start24Hour = 0;
        if (endPeriod === "PM" && end24Hour !== 12) end24Hour += 12;
        if (endPeriod === "AM" && end24Hour === 12) end24Hour = 0;
        
        const startMinutes = start24Hour * 60 + parseInt(startMinute);
        const endMinutes = end24Hour * 60 + parseInt(endMinute);
        
        return endMinutes - startMinutes;
      }
    }
    
    return 60;
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const duration = calculateDuration(formData.schedule);
    
    if (isEditing && classItem) {
      onSubmit({
        ...classItem,
        ...formData,
        duration,
      });
    } else {
      const newClass: Omit<Class, "id" | "created_at" | "updated_at"> = {
        name: formData.name,
        instructor: formData.instructor,
        schedule: formData.schedule,
        duration,
        capacity: formData.capacity,
        enrolled: 0,
        level: formData.level,
        location: formData.location,
        status: formData.status,
        description: formData.description || undefined,
      };
      
      onSubmit(newClass);
    }
    onClose();
  };

  const updateFormData = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.instructor;
      case 2:
        return formData.schedule;
      case 3:
        return formData.level && formData.location && formData.capacity > 0;
      default:
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isEditing ? "Edit Class" : "Add New Class"}
          </h2>
          <span className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex justify-between text-xs text-gray-500">
          {steps.map((step) => (
            <div key={step.id} className={`text-center ${currentStep >= step.id ? 'text-bjj-gold font-medium' : ''}`}>
              <div>{step.title}</div>
              <div className="text-xs">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <ClassBasicInfo 
              formData={formData}
              onUpdate={updateFormData}
            />
          )}
          
          {currentStep === 2 && (
            <ClassScheduleStep 
              schedule={formData.schedule}
              onUpdate={(schedule) => updateFormData("schedule", schedule)}
            />
          )}
          
          {currentStep === 3 && (
            <ClassDetailsStep 
              formData={formData}
              onUpdate={updateFormData}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 1 ? onClose : handlePrevious}
        >
          {currentStep === 1 ? (
            "Cancel"
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </>
          )}
        </Button>

        <Button
          onClick={currentStep === steps.length ? handleSubmit : handleNext}
          disabled={!isStepValid()}
          className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
        >
          {currentStep === steps.length ? (
            isEditing ? "Update Class" : "Create Class"
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
