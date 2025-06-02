
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
    branch: student?.branch || "Main Branch",
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
      console.log("Updated form data:", newData);
      return newData;
    });
  };

  const validateCurrentStep = () => {
    console.log("Validating step:", currentStep);
    console.log("Current form data:", formData);
    
    switch (currentStep) {
      case 1:
        const isStep1Valid = formData.name.trim() !== "" && formData.email.trim() !== "";
        console.log("Step 1 validation - Name:", formData.name, "Email:", formData.email, "Valid:", isStep1Valid);
        return isStep1Valid;
      case 2:
        const isStep2Valid = formData.belt.trim() !== "" && formData.coach.trim() !== "";
        console.log("Step 2 validation - Belt:", formData.belt, "Coach:", formData.coach, "Valid:", isStep2Valid);
        return isStep2Valid;
      case 3:
        const isStep3Valid = !formData.createAccount || (formData.username.trim() !== "" && formData.password.trim() !== "");
        console.log("Step 3 validation - Create account:", formData.createAccount, "Username:", formData.username, "Password:", formData.password ? "***" : "", "Valid:", isStep3Valid);
        return isStep3Valid;
      default:
        return false;
    }
  };

  const nextStep = () => {
    console.log("Next step button clicked");
    console.log("Current step:", currentStep);
    
    const isValid = validateCurrentStep();
    console.log("Is current step valid:", isValid);
    
    if (!isValid) {
      console.log("Validation failed - cannot proceed to next step");
      return;
    }
    
    if (currentStep < steps.length) {
      const newStep = currentStep + 1;
      console.log("Proceeding to step:", newStep);
      setCurrentStep(newStep);
    } else {
      console.log("Already at last step");
    }
  };

  const prevStep = () => {
    console.log("Previous step button clicked");
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      console.log("Going back to step:", newStep);
      setCurrentStep(newStep);
    }
  };

  const handleSubmit = () => {
    console.log("Form submission initiated");
    console.log("Final form data:", formData);
    
    if (!validateCurrentStep()) {
      console.log("Final validation failed");
      return;
    }
    
    const submissionData = {
      ...formData,
      phone: formData.phone || null,
      last_attended: formData.last_attended || null,
      username: formData.createAccount ? formData.username : undefined,
      password: formData.createAccount ? formData.password : undefined,
      createAccount: formData.createAccount,
    };
    
    const { class_enrollment, ...studentData } = submissionData;
    
    console.log("Submitting student data:", studentData);
    onSubmit(studentData);
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    console.log("Rendering content for step:", currentStep);
    
    switch (currentStep) {
      case 1:
        return (
          <StudentBasicInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <StudentClassInfoStep
            formData={formData}
            updateFormData={updateFormData}
            isEditing={isEditing}
          />
        );
      case 3:
        return (
          <StudentAccountStep
            formData={formData}
            updateFormData={updateFormData}
            isEditing={isEditing}
          />
        );
      default:
        console.error("Invalid step:", currentStep);
        return <div>Error: Invalid step {currentStep}</div>;
    }
  };

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
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
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
            disabled={!validateCurrentStep()}
            className="bg-bjj-gold hover:bg-bjj-gold-dark text-white"
          >
            {isEditing ? "Update Student" : "Add Student"}
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!validateCurrentStep()}
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
