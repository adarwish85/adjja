
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Coach } from "@/types/coach";
import { CoachBasicInfoStep } from "./CoachBasicInfoStep";
import { CoachProfessionalInfoStep } from "./CoachProfessionalInfoStep";
import { CoachClassAssignmentStep } from "./CoachClassAssignmentStep";
import { CoachAccountStep } from "./CoachAccountStep";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface MultiStepCoachFormProps {
  coach?: Coach;
  onSubmit: (coach: Omit<Coach, "id" | "created_at" | "updated_at">) => void;
  isEditing?: boolean;
}

const steps = [
  { id: 1, title: "Basic Information", description: "Personal details" },
  { id: 2, title: "Professional Info", description: "Belt & specialties" },
  { id: 3, title: "Class Assignment", description: "Assign classes" },
  { id: 4, title: "Account Setup", description: "Portal access credentials" },
];

export const MultiStepCoachForm = ({ coach, onSubmit, isEditing = false }: MultiStepCoachFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: coach?.name || "",
    email: coach?.email || "",
    phone: coach?.phone || "",
    belt: coach?.belt || "",
    branch: coach?.branch || "Main Branch",
    specialties: coach?.specialties || [],
    status: coach?.status || "active" as const,
    students_count: coach?.students_count || 0,
    assigned_classes: coach?.assigned_classes || [],
    joined_date: coach?.joined_date || new Date().toISOString().split('T')[0],
    username: "",
    password: "",
    createAccount: !isEditing,
    auth_user_id: coach?.auth_user_id || null,
    is_upgraded_student: coach?.is_upgraded_student || false,
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    console.log("MultiStepCoachForm: Updating form data:", updates);
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Handle phone field properly
      if ('phone' in updates) {
        newData.phone = updates.phone === "" ? null : updates.phone;
      }
      
      console.log("MultiStepCoachForm: Updated form data:", newData);
      return newData;
    });
  };

  const validateCurrentStep = () => {
    console.log("MultiStepCoachForm: Validating step:", currentStep);
    console.log("MultiStepCoachForm: Current form data:", formData);
    
    switch (currentStep) {
      case 1:
        const isStep1Valid = formData.name.trim() !== "" && formData.email.trim() !== "";
        console.log("MultiStepCoachForm: Step 1 validation - Name:", formData.name, "Email:", formData.email, "Valid:", isStep1Valid);
        if (!isStep1Valid) {
          toast.error("Please fill in all required fields: Name and Email");
        }
        return isStep1Valid;
      case 2:
        const isStep2Valid = formData.belt.trim() !== "";
        console.log("MultiStepCoachForm: Step 2 validation - Belt:", formData.belt, "Valid:", isStep2Valid);
        if (!isStep2Valid) {
          toast.error("Please select a belt rank");
        }
        return isStep2Valid;
      case 3:
        return true; // Class assignment is optional
      case 4:
        const isStep4Valid = !formData.createAccount || (formData.username.trim() !== "" && formData.password.trim() !== "");
        console.log("MultiStepCoachForm: Step 4 validation - Create account:", formData.createAccount, "Username:", formData.username, "Password:", formData.password ? "***" : "", "Valid:", isStep4Valid);
        if (!isStep4Valid) {
          toast.error("Please provide username and password for account creation");
        }
        return isStep4Valid;
      default:
        return false;
    }
  };

  const nextStep = () => {
    console.log("MultiStepCoachForm: Next step button clicked");
    const isValid = validateCurrentStep();
    console.log("MultiStepCoachForm: Is current step valid:", isValid);
    
    if (!isValid) {
      console.log("MultiStepCoachForm: Validation failed - cannot proceed to next step");
      return;
    }
    
    if (currentStep < steps.length) {
      const newStep = currentStep + 1;
      console.log("MultiStepCoachForm: Proceeding to step:", newStep);
      setCurrentStep(newStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("MultiStepCoachForm: Form submission initiated");
    console.log("MultiStepCoachForm: Final form data:", formData);
    
    if (!validateCurrentStep()) {
      console.log("MultiStepCoachForm: Final validation failed");
      return;
    }

    // Validate required fields for coach creation/update
    if (!formData.name.trim() || !formData.email.trim() || !formData.belt.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Prepare submission data with proper data structure
    const submissionData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone || null,
      belt: formData.belt.trim(),
      branch: formData.branch.trim(),
      specialties: Array.isArray(formData.specialties) ? formData.specialties : [],
      status: formData.status,
      students_count: formData.students_count,
      assigned_classes: Array.isArray(formData.assigned_classes) ? formData.assigned_classes : [],
      joined_date: formData.joined_date,
      auth_user_id: formData.auth_user_id,
      is_upgraded_student: formData.is_upgraded_student,
      // Only include account fields if creating account
      ...(formData.createAccount && {
        username: formData.username.trim(),
        password: formData.password.trim(),
        createAccount: formData.createAccount,
      }),
    };
    
    console.log("MultiStepCoachForm: Submitting coach data:", submissionData);
    onSubmit(submissionData);
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CoachBasicInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <CoachProfessionalInfoStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <CoachClassAssignmentStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <CoachAccountStep
            formData={{
              ...formData,
              email: formData.email
            }}
            updateFormData={updateFormData}
            isEditing={isEditing}
          />
        );
      default:
        return <div>Error: Invalid step {currentStep}</div>;
    }
  };

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
            {isEditing ? "Update Coach" : "Add Coach"}
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
