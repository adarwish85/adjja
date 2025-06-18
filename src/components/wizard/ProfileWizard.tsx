
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { BJJDetailsStep } from "./steps/BJJDetailsStep";
import { OptionalProfileStep } from "./steps/OptionalProfileStep";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WizardData {
  // Basic Info (Mandatory)
  name: string;
  phone: string;
  profile_picture_url: string;
  
  // BJJ Details (Mandatory)
  belt: string;
  stripes: number;
  years_practicing: number;
  previous_team: string;
  
  // Optional
  weight_kg?: number;
  height_cm?: number;
  favorite_position?: string;
  favorite_submission?: string;
  instagram_url?: string;
  facebook_url?: string;
  cover_photo_url?: string;
  gallery_images?: string[];
}

const steps = [
  { id: 1, title: "Basic Information", description: "Personal details and profile picture" },
  { id: 2, title: "BJJ Details", description: "Your martial arts background" },
  { id: 3, title: "Athlete Profile", description: "Optional additional information" }
];

export const ProfileWizard = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    name: "",
    phone: "",
    profile_picture_url: "",
    belt: "",
    stripes: 0,
    years_practicing: 0,
    previous_team: "",
  });

  // Skip wizard for non-Students
  if (userProfile && userProfile.role_name !== 'Student') {
    navigate("/dashboard");
    return null;
  }

  const updateWizardData = (stepData: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

  const progress = (currentStep / steps.length) * 100;

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(wizardData.name && wizardData.phone && wizardData.profile_picture_url);
      case 2:
        return !!(wizardData.belt && wizardData.years_practicing > 0 && wizardData.previous_team);
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

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

  const handleSubmit = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: wizardData.name,
          phone: wizardData.phone,
          profile_picture_url: wizardData.profile_picture_url,
          cover_photo_url: wizardData.cover_photo_url,
          mandatory_fields_completed: true,
          approval_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create/update BJJ profile
      const bjjProfileData = {
        user_id: user.id,
        belt_rank: wizardData.belt,
        weight_kg: wizardData.weight_kg,
        height_cm: wizardData.height_cm,
        favorite_position: wizardData.favorite_position,
        favorite_submission: wizardData.favorite_submission,
        instagram_url: wizardData.instagram_url,
        facebook_url: wizardData.facebook_url,
        gallery_images: wizardData.gallery_images || []
      };

      const { error: bjjError } = await supabase
        .from('bjj_profiles')
        .upsert(bjjProfileData, { onConflict: 'user_id' });

      if (bjjError) throw bjjError;

      // Create student record with mandatory BJJ info
      const { error: studentError } = await supabase
        .from('students')
        .insert({
          auth_user_id: user.id,
          name: wizardData.name,
          email: user.email || '',
          phone: wizardData.phone,
          belt: wizardData.belt,
          stripes: wizardData.stripes,
          branch: 'Main', // Default branch
          coach: 'TBD', // To be assigned
          membership_type: 'monthly',
          status: 'active'
        });

      if (studentError && !studentError.message.includes('duplicate')) {
        throw studentError;
      }

      // Log completion audit
      const auditData = {
        user_id: user.id,
        step_completed: 'wizard_completed',
        field_data: wizardData as any
      };

      const { error: auditError } = await supabase
        .from('profile_completion_audit')
        .insert(auditData);

      if (auditError) {
        console.error('Audit log error:', auditError);
        // Don't fail the whole process for audit logging
      }

      toast.success("Profile submitted successfully! Please wait for admin approval.");
      navigate("/profile-pending");
    } catch (error) {
      console.error('Profile submission error:', error);
      toast.error("Failed to submit profile. Please try again.");
    } finally {
      setIsSubmitting(false);
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
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id <= currentStep 
                    ? 'bg-bjj-gold text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>
                <span className="text-xs text-gray-600 mt-1 text-center">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="w-full" />
        </div>

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
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentStep === 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={skipOptionalStep}
                    disabled={isSubmitting}
                  >
                    Skip & Submit
                  </Button>
                )}
                
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-bjj-gold hover:bg-bjj-gold-dark"
                    disabled={!validateStep(currentStep)}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-bjj-gold hover:bg-bjj-gold-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Profile"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
