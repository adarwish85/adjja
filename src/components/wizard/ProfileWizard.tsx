

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { BJJDetailsStep } from "./steps/BJJDetailsStep";
import { OptionalProfileStep } from "./steps/OptionalProfileStep";
import { useAuthFlow } from "@/hooks/useAuthFlow";
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
  const { user, userProfile } = useAuthFlow();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>("");
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
    console.log('🔄 Updating wizard data:', stepData);
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

  const progress = (currentStep / steps.length) * 100;

  const validateMandatoryFields = (): string[] => {
    const errors: string[] = [];
    
    if (!wizardData.name?.trim()) {
      errors.push("Name is required");
    }
    
    if (!wizardData.phone?.trim()) {
      errors.push("Phone number is required");
    }
    
    if (!wizardData.profile_picture_url?.trim()) {
      errors.push("Profile picture is required");
    }
    
    if (!wizardData.belt?.trim()) {
      errors.push("BJJ belt rank is required");
    }
    
    if (!wizardData.years_practicing || wizardData.years_practicing <= 0) {
      errors.push("Years practicing BJJ is required and must be greater than 0");
    }
    
    if (!wizardData.previous_team?.trim()) {
      errors.push("Previous team/academy is required");
    }

    return errors;
  };

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
    
    console.log('🚀 Starting profile submission...');
    console.log('📋 Current wizard data:', wizardData);
    console.log('👤 Current user:', user);
    
    if (!user?.id) {
      const error = 'No authenticated user found';
      console.error('❌', error);
      setSubmissionError(error);
      toast.error(error);
      return;
    }

    // Validate mandatory fields
    const validationErrors = validateMandatoryFields();
    if (validationErrors.length > 0) {
      const errorMessage = `Missing required fields: ${validationErrors.join(', ')}`;
      console.error('❌ Validation failed:', validationErrors);
      setSubmissionError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      console.log('💾 Starting database updates...');

      // 1. Update profiles table with direct values (avoid self-referencing queries)
      const profileData = {
        id: user.id, // Include the required id field
        name: wizardData.name.trim(),
        email: user.email || '', // Add the required email field
        phone: wizardData.phone.trim(),
        profile_picture_url: wizardData.profile_picture_url,
        cover_photo_url: wizardData.cover_photo_url || null,
        mandatory_fields_completed: true,
        approval_status: 'pending',
        updated_at: new Date().toISOString()
      };

      console.log('📤 Updating profiles table:', profileData);

      // Use upsert with proper id included
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('❌ Profile update error:', profileError);
        throw new Error(`Profile update failed: ${profileError.message}`);
      }

      console.log('✅ Profile updated successfully');

      // 2. Create/update BJJ profile
      const bjjProfileData = {
        user_id: user.id,
        belt_rank: wizardData.belt,
        weight_kg: wizardData.weight_kg || null,
        height_cm: wizardData.height_cm || null,
        favorite_position: wizardData.favorite_position || null,
        favorite_submission: wizardData.favorite_submission || null,
        instagram_url: wizardData.instagram_url || null,
        facebook_url: wizardData.facebook_url || null,
        gallery_images: wizardData.gallery_images || []
      };

      console.log('📤 Upserting BJJ profile:', bjjProfileData);

      const { error: bjjError } = await supabase
        .from('bjj_profiles')
        .upsert(bjjProfileData, { onConflict: 'user_id' });

      if (bjjError) {
        console.error('❌ BJJ profile upsert error:', bjjError);
        throw new Error(`BJJ profile creation failed: ${bjjError.message}`);
      }

      console.log('✅ BJJ profile created successfully');

      // 3. Create/update student record
      const studentData = {
        auth_user_id: user.id,
        name: wizardData.name.trim(),
        email: user.email || '',
        phone: wizardData.phone.trim(),
        belt: wizardData.belt,
        stripes: wizardData.stripes || 0,
        branch: 'Main', // Default branch
        coach: 'TBD', // To be assigned
        membership_type: 'monthly',
        status: 'active'
      };

      console.log('📤 Creating/updating student record:', studentData);

      // Check if student already exists
      const { data: existingStudent, error: checkError } = await supabase
        .from('students')
        .select('id')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Student check error:', checkError);
        throw new Error(`Student check failed: ${checkError.message}`);
      }

      if (existingStudent) {
        // Update existing student
        const { error: updateError } = await supabase
          .from('students')
          .update(studentData)
          .eq('auth_user_id', user.id);

        if (updateError) {
          console.error('❌ Student update error:', updateError);
          throw new Error(`Student update failed: ${updateError.message}`);
        }
        console.log('✅ Student record updated successfully');
      } else {
        // Create new student
        const { error: insertError } = await supabase
          .from('students')
          .insert(studentData);

        if (insertError) {
          console.error('❌ Student insert error:', insertError);
          throw new Error(`Student creation failed: ${insertError.message}`);
        }
        console.log('✅ Student record created successfully');
      }

      // 4. Log completion audit
      const auditData = {
        user_id: user.id,
        step_completed: 'wizard_completed',
        field_data: wizardData as any
      };

      console.log('📤 Logging completion audit:', auditData);

      const { error: auditError } = await supabase
        .from('profile_completion_audit')
        .insert(auditData);

      if (auditError) {
        console.error('⚠️ Audit log error (non-critical):', auditError);
        // Don't fail the whole process for audit logging
      } else {
        console.log('✅ Audit log created successfully');
      }

      // 5. Create notification for user (optional)
      try {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: user.id, // This will be for the user themselves
            title: 'Profile Submitted',
            message: 'Your profile has been submitted for admin approval. You will be notified once approved.',
            type: 'info'
          });

        if (notificationError) {
          console.error('⚠️ Notification creation error (non-critical):', notificationError);
        } else {
          console.log('✅ User notification created successfully');
        }
      } catch (notifError) {
        console.error('⚠️ Notification creation failed (non-critical):', notifError);
      }

      console.log('🎉 Profile submission completed successfully!');
      toast.success("✅ Profile submitted successfully! Please wait for admin approval.");
      
      // Navigate to pending approval page
      navigate("/profile-pending");

    } catch (error) {
      console.error('💥 Profile submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during submission';
      setSubmissionError(errorMessage);
      toast.error(`Submission failed: ${errorMessage}`);
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
            
            {/* Error Display */}
            {submissionError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">Submission Error:</p>
                <p className="text-red-600 text-sm mt-1">{submissionError}</p>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
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
                    {isSubmitting ? "Submitting..." : "Skip & Submit"}
                  </Button>
                )}
                
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-bjj-gold hover:bg-bjj-gold-dark"
                    disabled={!validateStep(currentStep) || isSubmitting}
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

