
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Student } from "@/hooks/useStudents";
import { StudentBasicInfoStep } from "./StudentBasicInfoStep";
import { StudentClassInfoStep } from "./StudentClassInfoStep";
import { StudentClassEnrollmentStep } from "./StudentClassEnrollmentStep";
import { StudentAccountStep } from "./StudentAccountStep";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useClassEnrollments } from "@/hooks/useClassEnrollments";

interface MultiStepStudentFormProps {
  student?: Student;
  onSubmit: (student: Omit<Student, "id" | "created_at" | "updated_at">, classIds?: string[]) => void;
  isEditing?: boolean;
}

const steps = [
  { id: 1, title: "Basic Information", description: "Personal details" },
  { id: 2, title: "Belt & Membership", description: "Belt level & subscription" },
  { id: 3, title: "Class Enrollment", description: "Select classes to enroll in" },
  { id: 4, title: "Account Setup", description: "Portal access credentials" },
];

export const MultiStepStudentForm = ({ student, onSubmit, isEditing = false }: MultiStepStudentFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { enrollments } = useClassEnrollments();
  
  // Get current enrollments for editing student
  const currentEnrollments = isEditing && student ? 
    enrollments.filter(enrollment => 
      enrollment.student_id === student.id && enrollment.status === "active"
    ).map(enrollment => enrollment.class_id) : [];

  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    belt: student?.belt || "",
    stripes: student?.stripes || 0,
    status: student?.status || "active" as const,
    membership_type: student?.membership_type || "monthly" as const,
    subscription_plan_id: student?.subscription_plan_id || "",
    plan_start_date: student?.plan_start_date || new Date().toISOString().split('T')[0],
    attendance_rate: student?.attendance_rate || 0,
    joined_date: student?.joined_date || new Date().toISOString().split('T')[0],
    last_attended: student?.last_attended || new Date().toISOString().split('T')[0],
    selectedClassIds: currentEnrollments,
    username: "",
    password: "",
    createAccount: !isEditing,
    hasExistingAuth: false, // Track if user already has auth
  });

  // Update selectedClassIds when enrollments change for editing student
  useEffect(() => {
    if (isEditing && student && enrollments.length > 0) {
      const studentEnrollments = enrollments.filter(enrollment => 
        enrollment.student_id === student.id && enrollment.status === "active"
      ).map(enrollment => enrollment.class_id);
      
      setFormData(prev => ({
        ...prev,
        selectedClassIds: studentEnrollments
      }));
    }
  }, [isEditing, student, enrollments]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    console.log("MultiStepStudentForm: Updating form data:", updates);
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      console.log("MultiStepStudentForm: Updated form data:", newData);
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
        const isStep2Valid = formData.belt.trim() !== "" && formData.subscription_plan_id.trim() !== "" && formData.membership_type.trim() !== "";
        console.log("Step 2 validation - Belt:", formData.belt, "Plan:", formData.subscription_plan_id, "Membership:", formData.membership_type, "Valid:", isStep2Valid);
        return isStep2Valid;
      case 3:
        // Class enrollment is optional, so always valid
        return true;
      case 4:
        // If user has existing auth or doesn't want to create account, skip validation
        // If creating account and no existing auth, validate username/password
        const needsCredentials = formData.createAccount && !formData.hasExistingAuth;
        const isStep4Valid = !needsCredentials || (formData.username.trim() !== "" && formData.password.trim() !== "");
        console.log("Step 4 validation - Create account:", formData.createAccount, "Has existing auth:", formData.hasExistingAuth, "Username:", formData.username, "Password:", formData.password ? "***" : "", "Valid:", isStep4Valid);
        return isStep4Valid;
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
    console.log("MultiStepStudentForm: Form submission initiated");
    console.log("MultiStepStudentForm: Final form data:", formData);
    
    if (!validateCurrentStep()) {
      console.log("MultiStepStudentForm: Final validation failed");
      return;
    }
    
    // Clean and prepare submission data
    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      branch: "Main Branch", // Default branch since we removed it from the form
      belt: formData.belt,
      stripes: formData.stripes,
      coach: "Unassigned", // Default coach since we removed it from the form
      status: formData.status,
      membership_type: formData.membership_type,
      subscription_plan_id: formData.subscription_plan_id || null,
      plan_start_date: formData.plan_start_date || null,
      next_due_date: null,
      payment_status: "unpaid" as const,
      attendance_rate: formData.attendance_rate,
      joined_date: formData.joined_date,
      last_attended: formData.last_attended || null,
      // Only include account fields if creating account and no existing auth
      ...(formData.createAccount && !formData.hasExistingAuth && {
        username: formData.username,
        password: formData.password,
        createAccount: formData.createAccount,
      }),
    };
    
    console.log("MultiStepStudentForm: Submitting student data:", submissionData);
    console.log("MultiStepStudentForm: Selected class IDs:", formData.selectedClassIds);
    onSubmit(submissionData, formData.selectedClassIds);
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
          <StudentClassEnrollmentStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
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

  console.log("MultiStepStudentForm: Rendering - Current step:", currentStep, "Progress:", progress);

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
