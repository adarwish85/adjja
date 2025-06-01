
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
  { id: 2, title: "Class Information", description: "Belt, coach & class enrollment" },
  { id: 3, title: "Account Setup", description: "Portal access credentials" },
];

export const MultiStepStudentForm = ({ student, onSubmit, isEditing = false }: MultiStepStudentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    branch: student?.branch || "Main Branch", // Default branch since it's required in backend
    belt: student?.belt || "",
    stripes: student?.stripes || 0,
    coach: student?.coach || "",
    status: student?.status || "active" as const,
    membership_type: student?.membership_type || "monthly" as const,
    attendance_rate: student?.attendance_rate || 0,
    joined_date: student?.joined_date || new Date().toISOString().split('T')[0],
    last_attended: student?.last_attended || new Date().toISOString().split('T')[0],
    class_enrollment: undefined as string | undefined,
    username: "",
    password: "",
    createAccount: !isEditing,
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    console.log("Updating form data:", updates);
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      console.log("New form data:", newData);
      return newData;
    });
  };

  const nextStep = () => {
    console.log("Next step clicked, current step:", currentStep);
    console.log("Form data at next step:", formData);
    console.log("Is step valid:", isStepValid());
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      console.log("Moving to step:", currentStep + 1);
    }
  };

  const prevStep = () => {
    console.log("Previous step clicked, current step:", currentStep);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      console.log("Moving to step:", currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submission data:", formData);
    
    const submissionData = {
      ...formData,
      phone: formData.phone || null,
      last_attended: formData.last_attended || null,
      username: formData.createAccount ? formData.username : undefined,
      password: formData.createAccount ? formData.password : undefined,
      createAccount: formData.createAccount,
    };
    
    // Remove class_enrollment from the submission data as it's not part of the Student interface
    const { class_enrollment, ...studentData } = submissionData;
    
    console.log("Submitting student data:", studentData);
    onSubmit(studentData);
  };

  const isStepValid = () => {
    console.log("Validating step:", currentStep, "with form data:", formData);
    
    switch (currentStep) {
      case 1:
        // Only validate name and email since branch is automatically set to default
        const step1Valid = !!(formData.name && formData.email);
        console.log("Step 1 validation:", { name: formData.name, email: formData.email, valid: step1Valid });
        return step1Valid;
      case 2:
        const step2Valid = !!(formData.belt && formData.coach);
        console.log("Step 2 validation:", { belt: formData.belt, coach: formData.coach, valid: step2Valid });
        return step2Valid;
      case 3:
        const step3Valid = !formData.createAccount || (formData.username && formData.password);
        console.log("Step 3 validation:", { createAccount: formData.createAccount, username: formData.username, password: formData.password, valid: step3Valid });
        return step3Valid;
      default:
        console.log("Invalid step:", currentStep);
        return false;
    }
  };

  const progress = (currentStep / steps.length) * 100;

  console.log("Rendering MultiStepStudentForm - Current step:", currentStep, "Progress:", progress);

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
