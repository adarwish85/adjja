
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={local.name}
                onChange={e => handleChange('name', e.target.value)}
                className={`border-2 rounded-lg ${
                  validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'
                }`}
                required
              />
              {validationErrors.name && (
                <p className="text-xs text-red-500">{validationErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={local.email}
                onChange={e => handleChange('email', e.target.value)}
                className={`border-2 rounded-lg ${
                  validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'
                }`}
                required
              />
              {validationErrors.email && (
                <p className="text-xs text-red-500">{validationErrors.email}</p>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={local.phone || ""}
                onChange={e => handleChange('phone', e.target.value)}
                className={`border-2 rounded-lg ${
                  validationErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'
                }`}
                placeholder="Enter your phone number"
              />
              {validationErrors.phone && (
                <p className="text-xs text-red-500">{validationErrors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthdate">Date of Birth</Label>
              <Input
                id="birthdate"
                type="date"
                value={local.birthdate || ""}
                onChange={e => handleChange('birthdate', e.target.value)}
                className="border-2 border-gray-200 focus:border-bjj-gold rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Information (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-bjj-navy">Academy Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="belt">Belt Rank</Label>
              <Input
                id="belt"
                value={local.belt || ""}
                className="bg-gray-100 border-gray-300 cursor-not-allowed"
                readOnly
                disabled
              />
              <p className="text-xs text-gray-500">Managed by academy staff</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stripes">Stripes</Label>
              <Input
                id="stripes"
                value={local.stripes || 0}
                className="bg-gray-100 border-gray-300 cursor-not-allowed"
                readOnly
                disabled
              />
              <p className="text-xs text-gray-500">Managed by academy staff</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={local.branch || ""}
                className="bg-gray-100 border-gray-300 cursor-not-allowed"
                readOnly
                disabled
              />
              <p className="text-xs text-gray-500">Contact admin to change</p>
            </div>
          </div>
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
