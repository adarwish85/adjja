
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCoachAccountInfoProps {
  formData: {
    username: string;
    password: string;
    createAccount: boolean;
  };
  setFormData: (updater: (prev: any) => any) => void;
  isEditing: boolean;
}

export const AddCoachAccountInfo = ({ formData, setFormData, isEditing }: AddCoachAccountInfoProps) => {
  return (
    <div className="border-t pt-4 space-y-4">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="createAccount"
          checked={formData.createAccount}
          onChange={(e) => setFormData(prev => ({ ...prev, createAccount: e.target.checked }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
