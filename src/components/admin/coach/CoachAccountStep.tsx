
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CoachAccountStepProps {
  formData: {
    username: string;
    password: string;
    createAccount: boolean;
  };
  updateFormData: (updates: any) => void;
  isEditing: boolean;
}

export const CoachAccountStep = ({ formData, updateFormData, isEditing }: CoachAccountStepProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="createAccount"
          checked={formData.createAccount}
          onChange={(e) => updateFormData({ createAccount: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="createAccount" className="text-sm font-medium">
          {isEditing ? "Create coach portal account" : "Create coach portal account"}
        </Label>
      </div>
      
      {formData.createAccount && (
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
          The coach will be added without portal access. You can create an account later by editing the coach.
        </div>
      )}
    </div>
  );
};
