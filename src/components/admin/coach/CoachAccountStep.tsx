
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthUserDetection } from "@/hooks/useAuthUserDetection";

interface CoachAccountStepProps {
  formData: {
    username: string;
    password: string;
    createAccount: boolean;
    email?: string;
    auth_user_id?: string | null;
  };
  updateFormData: (updates: any) => void;
  isEditing: boolean;
}

export const CoachAccountStep = ({ formData, updateFormData, isEditing }: CoachAccountStepProps) => {
  const [hasAuthUser, setHasAuthUser] = useState(false);
  const [authDetectionMethod, setAuthDetectionMethod] = useState<'auth_user_id' | 'email' | null>(null);
  const { checkAuthUserStatus, checking } = useAuthUserDetection();

  useEffect(() => {
    async function checkAuth() {
      if (formData.email || formData.auth_user_id) {
        console.log("CoachAccountStep: Checking auth status", {
          email: formData.email,
          auth_user_id: formData.auth_user_id,
          isEditing
        });
        
        const result = await checkAuthUserStatus(formData.email || "", formData.auth_user_id || undefined);
        
        console.log("CoachAccountStep: Auth check result:", result);
        
        setHasAuthUser(result.hasAuthAccount);
        setAuthDetectionMethod(result.method || null);
        
        // If user already has auth account, disable the checkbox and set it as checked
        if (result.hasAuthAccount) {
          updateFormData({ createAccount: true });
        }
      }
    }
    
    checkAuth();
  }, [formData.email, formData.auth_user_id, checkAuthUserStatus, updateFormData]);

  const isCheckboxDisabled = hasAuthUser;
  const shouldShowAsChecked = hasAuthUser || formData.createAccount;

  const getStatusMessage = () => {
    if (hasAuthUser) {
      if (authDetectionMethod === 'auth_user_id') {
        return "This coach already has portal access (detected via account link)";
      } else if (authDetectionMethod === 'email') {
        return "This coach already has portal access (detected via email)";
      }
      return "This coach already has portal access";
    }
    return null;
  };

  const getStatusBadgeText = () => {
    if (authDetectionMethod === 'auth_user_id') {
      return "Account Linked";
    } else if (authDetectionMethod === 'email') {
      return "Portal Access Exists";
    }
    return "Portal Access Exists";
  };

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
          {hasAuthUser ? "Already has portal access" : (isEditing ? "Create coach portal account" : "Create coach portal account")}
        </Label>
        
        {hasAuthUser && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="ml-2">{getStatusBadgeText()}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This coach already has login credentials and can access the portal</p>
                {authDetectionMethod === 'auth_user_id' && (
                  <p className="text-xs mt-1">Detected via direct account link</p>
                )}
                {authDetectionMethod === 'email' && (
                  <p className="text-xs mt-1">Detected via email match</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {checking && (
          <span className="text-sm text-gray-500 ml-2">Checking portal access...</span>
        )}
      </div>
      
      {hasAuthUser && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
          {getStatusMessage()}
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
          The coach will be added without portal access. You can create an account later by editing the coach.
        </div>
      )}
    </div>
  );
};
