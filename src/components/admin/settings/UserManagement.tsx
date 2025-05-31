
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Lock,
  Search,
  Edit,
  Trash2
} from "lucide-react";
import { useSettings, UserManagementSettings as UserManagementSettingsType } from "@/hooks/useSettings";

export const UserManagement = () => {
  const { defaultUserManagementSettings, saveUserManagementSettings, isLoading } = useSettings();
  const [settings, setSettings] = useState<UserManagementSettingsType>(defaultUserManagementSettings);

  const adminUsers = [
    { id: 1, name: "John Smith", email: "john@adjja.com", role: "Super Admin", status: "Active", lastLogin: "2 hours ago" },
    { id: 2, name: "Sarah Wilson", email: "sarah@adjja.com", role: "Admin", status: "Active", lastLogin: "1 day ago" },
    { id: 3, name: "Mike Johnson", email: "mike@adjja.com", role: "Manager", status: "Inactive", lastLogin: "1 week ago" },
  ];

  const rolePermissions = [
    { role: "Super Admin", permissions: ["Full Access", "User Management", "System Settings", "Financial Data"] },
    { role: "Admin", permissions: ["User Management", "Class Scheduling", "Student Records", "Reports"] },
    { role: "Manager", permissions: ["Class Scheduling", "Student Records", "Basic Reports"] },
    { role: "Coach", permissions: ["Class Management", "Student Attendance", "Basic Reports"] },
  ];

  const handleSave = async () => {
    await saveUserManagementSettings(settings);
  };

  const handleReset = () => {
    setSettings(defaultUserManagementSettings);
  };

  return (
    <div className="space-y-6">
      {/* User Registration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            User Registration Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Allow Self Registration</h4>
              <p className="text-sm text-bjj-gray">Allow users to create their own accounts</p>
            </div>
            <Switch 
              checked={settings.allowSelfRegistration}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowSelfRegistration: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Verification Required</h4>
              <p className="text-sm text-bjj-gray">Require email verification for new accounts</p>
            </div>
            <Switch 
              checked={settings.emailVerificationRequired}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailVerificationRequired: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Manual Approval</h4>
              <p className="text-sm text-bjj-gray">Require admin approval for new registrations</p>
            </div>
            <Switch 
              checked={settings.manualApproval}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, manualApproval: checked }))}
            />
          </div>
          <div>
            <Label htmlFor="default-role">Default Role for New Users</Label>
            <Select 
              value={settings.defaultRole} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, defaultRole: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Admin Users Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Users
            </CardTitle>
            <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-bjj-gray" />
              <Input placeholder="Search admin users..." className="max-w-sm" />
            </div>
            <div className="space-y-3">
              {adminUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-bjj-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-bjj-navy font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-bjj-navy">{user.name}</h4>
                      <p className="text-sm text-bjj-gray">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">{user.role}</Badge>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    <span className="text-sm text-bjj-gray">{user.lastLogin}</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rolePermissions.map((role) => (
              <div key={role.role} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-bjj-navy">{role.role}</h4>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Permissions
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <Badge key={permission} variant="outline">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="min-length">Minimum Password Length</Label>
            <Input 
              id="min-length" 
              type="number" 
              value={settings.minPasswordLength}
              onChange={(e) => setSettings(prev => ({ ...prev, minPasswordLength: parseInt(e.target.value) }))}
              className="max-w-sm" 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Require Uppercase Letters</h4>
              <p className="text-sm text-bjj-gray">At least one uppercase letter</p>
            </div>
            <Switch 
              checked={settings.requireUppercase}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireUppercase: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Require Numbers</h4>
              <p className="text-sm text-bjj-gray">At least one number</p>
            </div>
            <Switch 
              checked={settings.requireNumbers}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireNumbers: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Require Special Characters</h4>
              <p className="text-sm text-bjj-gray">At least one special character</p>
            </div>
            <Switch 
              checked={settings.requireSpecialChars}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireSpecialChars: checked }))}
            />
          </div>
          <div>
            <Label htmlFor="password-expiry">Password Expiry (days)</Label>
            <Input 
              id="password-expiry" 
              type="number" 
              value={settings.passwordExpiry}
              onChange={(e) => setSettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
              className="max-w-sm" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Reset to Defaults
        </Button>
        <Button 
          className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};
