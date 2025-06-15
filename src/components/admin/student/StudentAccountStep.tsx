
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthUserDetection } from "@/hooks/useAuthUserDetection";

interface StudentAccountStepProps {
  formData: {
    username: string;
    password: string;
    createAccount: boolean;
    email?: string;
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
  const { checkAuthUserByEmail, checking } = useAuthUserDetection();

  useEffect(() => {
    async function check() {
      if (formData.email) {
        const result = await checkAuthUserByEmail(formData.email);
        setHasAuthUser(result.hasAuthAccount);
        
        // If user already has auth account, disable the checkbox and set it as checked
        if (result.hasAuthAccount) {
          updateFormData({ createAccount: true });
        }
      }
    }
    
    if (formData.email) {
      check();
    }
  }, [formData.email, checkAuthUserByEmail, updateFormData]);

  const isCheckboxDisabled = hasAuthUser;
  const shouldShowAsChecked = hasAuthUser || formData.createAccount;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="createAccount"
          checked={shouldShowAsChecked}
          onChange={(e) => !isCheckboxDisabled && updateFormData({ createAccount: e.target.checked })}
          disabled={isCheckboxDisabled}
          className="rounded"
        />
        <Label htmlFor="createAccount" className="text-sm font-medium">
          {hasAuthUser ? "Already has portal access" : (isEditing ? "Create student portal account" : "Create student portal account")}
        </Label>
        
        {hasAuthUser && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="ml-2">Portal Access Exists</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This student already has login credentials and can access the portal</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {checking && (
          <span className="text-sm text-gray-500 ml-2">Checking...</span>
        )}
      </div>
      
      {hasAuthUser && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
          This student already has portal access and can log in with their existing credentials.
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
      
      {!formData.createAccount && !hasAuthUser && (
        <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-md">
          The student will be added without portal access. You can create an account later by editing the student.
        </div>
      )}
    </div>
  );
};
