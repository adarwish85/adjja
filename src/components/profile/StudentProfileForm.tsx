import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { StudentPersonalInfo } from "./StudentPersonalInfo";
import { StudentAcademyInfo } from "./StudentAcademyInfo";

interface StudentProfileFormProps {
  data: {
    name: string;
    email: string;
    phone?: string;
    belt?: string;
    branch?: string;
    birthdate?: string;
    stripes?: number;
    joined_date?: string;
  };
  onChange: (data: any) => void;
  loading: boolean;
  onSave: () => Promise<void>;
  saveState: "idle" | "saving" | "success" | "error";
  hasChanges?: boolean;
}

export function StudentProfileForm({
  data,
  onChange,
  loading,
  onSave,
  saveState,
  hasChanges = false
}: StudentProfileFormProps) {
  const [local, setLocal] = useState({ ...data });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Sync with parent data changes
  useEffect(() => {
    setLocal({ ...data });
  }, [data]);

  const validateField = (field: string, value: string) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required';
        } else {
          delete errors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'phone':
        if (value && value.length < 10) {
          errors.phone = 'Phone number must be at least 10 digits';
        } else {
          delete errors.phone;
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    const newLocal = { ...local, [field]: value };
    setLocal(newLocal);
    
    // Validate the field
    validateField(field, value);
    
    // Only pass valid data to parent
    if (Object.keys(validationErrors).length === 0) {
      onChange(newLocal);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before save
    const isNameValid = validateField('name', local.name);
    const isEmailValid = validateField('email', local.email);
    const isPhoneValid = validateField('phone', local.phone || '');
    
    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    try {
      await onSave();
    } catch (error) {
      console.error('Save error:', error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-bjj-navy">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StudentPersonalInfo
            local={local}
            validationErrors={validationErrors}
            handleChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* System Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-bjj-navy">Academy Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <StudentAcademyInfo local={local} />
        </CardContent>
      </Card>

      {/* Save Button - Only show if there are changes */}
      {hasChanges && (
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="font-semibold bg-bjj-gold hover:bg-bjj-gold-dark text-white rounded-lg px-8 py-3 text-lg shadow-lg transition"
            disabled={loading || saveState === "saving" || Object.keys(validationErrors).length > 0}
          >
            {saveState === "saving" ? "Saving..." : saveState === "success" ? "Saved!" : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
