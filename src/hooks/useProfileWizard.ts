
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface WizardData {
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

export const useProfileWizard = () => {
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

  const updateWizardData = (stepData: Partial<WizardData>) => {
    console.log('🔄 Updating wizard data:', stepData);
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

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

      // 1. Update profiles table with direct values
      const profileData = {
        id: user.id,
        name: wizardData.name.trim(),
        email: user.email || '',
        phone: wizardData.phone.trim(),
        profile_picture_url: wizardData.profile_picture_url,
        cover_photo_url: wizardData.cover_photo_url || null,
        mandatory_fields_completed: true,
        approval_status: 'pending',
        updated_at: new Date().toISOString()
      };

      console.log('📤 Updating profiles table:', profileData);

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
        branch: 'Main',
        coach: 'TBD',
        membership_type: 'monthly',
        status: 'active'
      };

      console.log('📤 Creating/updating student record:', studentData);

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
      } else {
        console.log('✅ Audit log created successfully');
      }

      // 5. Create notification for user
      try {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
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

  return {
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
  };
};
