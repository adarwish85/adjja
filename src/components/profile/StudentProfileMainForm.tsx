
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Mail, Phone, Calendar, Save } from "lucide-react";

interface StudentProfileMainFormProps {
  data: {
    name: string;
    email: string;
    phone?: string;
    birthdate?: string;
  };
  onChange: (data: any) => void;
  loading: boolean;
  onSave: () => Promise<void>;
  saveState: "idle" | "saving" | "success" | "error";
  hasChanges?: boolean;
}

export function StudentProfileMainForm({
  data,
  onChange,
  loading,
  onSave,
  saveState,
  hasChanges = false
}: StudentProfileMainFormProps) {
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
    
    // Always pass data to parent for change tracking
    onChange(newLocal);
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
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-bjj-gold" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  value={local.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className={`pl-10 h-12 border-2 rounded-xl ${
                    validationErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {validationErrors.name && (
                <p className="text-xs text-red-500">{validationErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={local.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className={`pl-10 h-12 border-2 rounded-xl ${
                    validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'
                  }`}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              {validationErrors.email && (
                <p className="text-xs text-red-500">{validationErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={local.phone || ""}
                  onChange={e => handleChange('phone', e.target.value)}
                  className={`pl-10 h-12 border-2 rounded-xl ${
                    validationErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-bjj-gold'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {validationErrors.phone && (
                <p className="text-xs text-red-500">{validationErrors.phone}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-sm font-medium text-gray-700">
                Date of Birth
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="birthdate"
                  type="date"
                  value={local.birthdate || ""}
                  onChange={e => handleChange('birthdate', e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-bjj-gold rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Save Button - Sticky when changes are made */}
          {hasChanges && (
            <div className="sticky bottom-6 flex justify-end pt-6 border-t border-gray-100">
              <Button
                type="submit"
                className="font-semibold bg-bjj-gold hover:bg-bjj-gold-dark text-white rounded-xl px-8 py-4 text-lg shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                disabled={loading || saveState === "saving" || Object.keys(validationErrors).length > 0}
              >
                <Save className="h-5 w-5" />
                {saveState === "saving" ? "Saving..." : saveState === "success" ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
