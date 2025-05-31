
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Student } from "@/hooks/useStudents";
import { StudentBasicInfoStep } from "./StudentBasicInfoStep";
import { StudentClassInfoStep } from "./StudentClassInfoStep";
import { StudentAccountStep } from "./StudentAccountStep";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MultiStepStudentFormProps {
  student?: Student;
  onSubmit: (student: Omit<Student, "id" | "created_at" | "updated_at">) => void;
  isEditing?: boolean;
}

const steps = [
  { id: 1, title: "Basic Information", description: "Personal details" },
  { id: 2, title: "Class Information", description: "Belt, coach & membership" },
  { id: 3, title: "Account Setup", description: "Portal access credentials" },
];

export const MultiStepStudentForm = ({ student, onSubmit, isEditing = false }: MultiStepStudentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    branch: student?.branch || "",
    belt: student?.belt || "",
    stripes: student?.stripes || 0,
    coach: student?.coach || "",
    status: student?.status || "active" as const,
    membership_type: student?.membership_type || "monthly" as const,
    attendance_rate: student?.attendance_rate || 0,
    joined_date: student?.joined_date || new Date().toISOString().split('T')[0],
    last_attended: student?.last_attended || new Date().toISOString().split('T')[0],
    username: "",
    password: "",
    createAccount: !isEditing,
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const submissionData = {
      ...formData,
      phone: formData.phone || null,
      last_attended: formData.last_attended || null,
      username: formData.createAccount ? formData.username : undefined,
      password: formData.createAccount ? formData.password : undefined,
      createAccount: formData.createAccount,
    };
    onSubmit(submissionData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.branch && formData.belt && formData.coach;
      case 3:
        return !formData.createAccount || (formData.username && formData.password);
      default:
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps Navigation */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex flex-col items-center space-y-1 ${
              step.id === currentStep
                ? "text-bjj-gold"
                : step.id < currentStep
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step.id === currentStep
                  ? "border-bjj-gold bg-bjj-gold text-white"
                  : step.id < currentStep
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              {step.id}
            </div>
            <div className="text-center">
              <div className="text-xs font-medium">{step.title}</div>
              <div className="text-xs">{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <StudentBasicInfoStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <StudentClassInfoStep
              formData={formData}
              updateFormData={updateFormData}
              isEditing={isEditing}
            />
          )}
          {currentStep === 3 && (
            <StudentAccountStep
              formData={formData}
              updateFormData={updateFormData}
              isEditing={isEditing}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep === steps.length ? (
          <Button
            onClick={handleSubmit}
            disabled={!isStepValid()}
            className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
          >
            {isEditing ? "Update Student" : "Add Student"}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
