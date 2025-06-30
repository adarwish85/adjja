
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
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
  const { user, userProfile, isSuperAdmin, authInitialized } = useAuth();
  const {
    currentStep,
    setCurrentStep,
    isSubmitting,
    submissionError,
    wizardData,
    updateWizardData,
    validateStep,
    handleSubmit
  } = useProfileWizard();

  // Redirect Super Admin immediately
  useEffect(() => {
    if (authInitialized && user) {
      console.log('🔍 ProfileWizard: Checking user redirect');
      console.log('👤 User:', user.email);
      console.log('👑 Is Super Admin:', isSuperAdmin());
      console.log('📋 User Profile:', userProfile);

      // Super Admin should never see profile wizard
      if (isSuperAdmin()) {
        console.log('🎯 Super Admin detected, redirecting to admin dashboard');
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // Regular users with completed profiles who are approved should go to dashboard
      if (userProfile) {
        const role = userProfile.role_name?.toLowerCase();
        const approvalStatus = userProfile.approval_status;
        const profileCompleted = userProfile.profile_completed;
        const mandatoryCompleted = userProfile.mandatory_fields_completed;

        console.log('📊 Profile Status Check:');
        console.log('- Role:', role);
        console.log('- Approval Status:', approvalStatus);
        console.log('- Profile Completed:', profileCompleted);
        console.log('- Mandatory Completed:', mandatoryCompleted);

        // If profile is already completed and approved, redirect to appropriate dashboard
        if (profileCompleted && approvalStatus === 'approved') {
          if (role === 'coach') {
            console.log('🎯 Redirecting approved coach to coach dashboard');
            navigate("/coach/dashboard", { replace: true });
          } else {
            console.log('🎯 Redirecting approved student to dashboard');
            navigate("/dashboard", { replace: true });
          }
          return;
        }

        // If mandatory fields are completed but pending approval, go to pending page
        if (mandatoryCompleted && (approvalStatus === 'pending' || approvalStatus === 'rejected')) {
          console.log('🎯 Redirecting to profile pending page');
          navigate("/profile-pending", { replace: true });
          return;
        }
      }
    }
  }, [user, userProfile, isSuperAdmin, authInitialized, navigate]);

  // Show loading while auth is initializing
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-bjj-gray">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render wizard for Super Admin (should have been redirected)
  if (isSuperAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bjj-gold mx-auto mb-4"></div>
          <p className="text-bjj-gray">Redirecting to Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  // Skip wizard for non-Students (Coaches shouldn't use wizard)
  if (userProfile && userProfile.role_name?.toLowerCase() === 'coach') {
    console.log('🎯 Coach detected, redirecting to coach dashboard');
    navigate("/coach/dashboard", { replace: true });
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
