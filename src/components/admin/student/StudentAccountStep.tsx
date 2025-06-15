
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useStudentAuthStatus } from "@/hooks/useStudentAuthStatus";

interface StudentAccountStepProps {
  formData: {
    username: string;
    password: string;
    createAccount: boolean;
    email?: string; // Add email here for checking
  };
  updateFormData: (updates: any) => void;
  isEditing: boolean;
}

export const StudentAccountStep = ({
  formData,
  updateFormData,
  isEditing,
}: StudentAccountStepProps) => {
  const [hasAuthUser, setHasAuthUser] = useState(false);
  const { checkAuthUserByEmail, checking } = useStudentAuthStatus();

  useEffect(() => {
    async function check() {
      if (formData.email) {
        const exists = await checkAuthUserByEmail(formData.email);
        setHasAuthUser(exists);
      }
    }
    // Only check if email exists
    if (formData.email) check();
  }, [formData.email, checkAuthUserByEmail]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="createAccount"
          checked={formData.createAccount}
          onChange={(e) => updateFormData({ createAccount: e.target.checked })}
          className="rounded"
          disabled={hasAuthUser}
        />
        <Label htmlFor="createAccount" className="text-sm font-medium">
          {isEditing ? "Create student portal account" : "Create student portal account"}
        </Label>
        {hasAuthUser && (
          <Badge variant="secondary" className="ml-2">Auth User Exists</Badge>
        )}
      </div>
      {formData.createAccount && hasAuthUser && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          This student already has portal access.
        </div>
      )}
      {formData.createAccount && !hasAuthUser && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => updateFormData({ username: e.target.value })}
              placeholder="Enter username"
              required={formData.createAccount}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => updateFormData({ password: e.target.value })}
              placeholder="Enter password"
              required={formData.createAccount}
            />
          </div>
        </div>
      )}
      {!formData.createAccount && (
        <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-md">
          The student will be added without portal access. You can create an account later by editing the student.
        </div>
      )}
    </div>
  );
};
