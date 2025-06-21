
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { BJJDetailsStep } from "./steps/BJJDetailsStep";
import { OptionalProfileStep } from "./steps/OptionalProfileStep";
import { WizardProgress } from "./WizardProgress";
import { WizardNavigation } from "./WizardNavigation";
import { WizardErrorDisplay } from "./WizardErrorDisplay";
import { useProfileWizard } from "@/hooks/useProfileWizard";

const steps = [
  { id: 1, title: "Basic Information", description: "Personal details and profile picture" },
  { id: 2, title: "BJJ Details", description: "Your martial arts background" },
  { id: 3, title: "Athlete Profile", description: "Optional additional information" }
];

export const ProfileWizard = () => {
  const navigate = useNavigate();
  const {
    user,
    userProfile,
    currentStep,
    setCurrentStep,
    isSubmitting,
    submissionError,
    wizardData,
    updateWizardData,
    validateStep,
    handleSubmit
  } = useProfileWizard();

  // Skip wizard for non-Students
  if (userProfile && userProfile.role_name !== 'Student') {
    navigate("/dashboard");
    return null;
  }

  const nextStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast.error("Please fill in all required fields before continuing");
    }
  };

  const prevStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const skipOptionalStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (currentStep === 3) {
      handleSubmit();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={wizardData}
            updateData={updateWizardData}
          />
        );
      case 2:
        return (
          <BJJDetailsStep
            data={wizardData}
            updateData={updateWizardData}
          />
        );
      case 3:
        return (
          <OptionalProfileStep
            data={wizardData}
            updateData={updateWizardData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-bjj-navy mb-2">Complete Your Profile</h1>
          <p className="text-bjj-gray">Let's set up your athlete profile in a few simple steps</p>
        </div>

        {/* Progress Bar */}
        <WizardProgress steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-bjj-navy">
              {steps[currentStep - 1]?.title}
            </CardTitle>
            <p className="text-bjj-gray">{steps[currentStep - 1]?.description}</p>
          </CardHeader>
          <CardContent>
            {renderStep()}
            
            {/* Error Display */}
            <WizardErrorDisplay error={submissionError} />
            
            {/* Navigation Buttons */}
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={steps.length}
              isSubmitting={isSubmitting}
              onPrevious={prevStep}
              onNext={nextStep}
              onSkipAndSubmit={skipOptionalStep}
              onSubmit={handleSubmit}
              isStepValid={validateStep(currentStep)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
