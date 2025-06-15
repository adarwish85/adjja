
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, Calendar } from "lucide-react";

interface StudentProfileMainFormProps {
  data: {
    name: string;
    email: string;
    phone?: string;
    birthdate?: string;
  };
  onChange: (data: any) => void;
  loading: boolean;
  disabled?: boolean;
}

export function StudentProfileMainForm({
  data,
  onChange,
  loading,
  disabled = false
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
    if (disabled) return;
    
    const newLocal = { ...local, [field]: value };
    setLocal(newLocal);
    
    // Validate the field
    validateField(field, value);
    
    // Always pass data to parent for change tracking
    onChange(newLocal);
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
        <div className="space-y-6">
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
                  } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your full name"
                  disabled={disabled}
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
                  } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your email address"
                  disabled={disabled}
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
                  } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your phone number"
                  disabled={disabled}
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
                  className={`pl-10 h-12 border-2 rounded-xl ${
                    disabled ? 'bg-gray-50 cursor-not-allowed border-gray-200' : 'border-gray-200 focus:border-bjj-gold'
                  }`}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
