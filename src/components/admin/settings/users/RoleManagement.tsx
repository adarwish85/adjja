
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  Settings,
  Lock
} from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem: boolean;
}

const mockPermissions: Permission[] = [
  { id: "1", name: "manage_users", description: "Create, edit, and delete users", category: "User Management" },
  { id: "2", name: "manage_roles", description: "Create and modify user roles", category: "User Management" },
  { id: "3", name: "view_analytics", description: "Access analytics and reports", category: "Analytics" },
  { id: "4", name: "manage_classes", description: "Create and manage classes", category: "Classes" },
  { id: "5", name: "manage_students", description: "Manage student records", category: "Students" },
  { id: "6", name: "manage_coaches", description: "Manage coach profiles", category: "Coaches" },
  { id: "7", name: "manage_payments", description: "Process and view payments", category: "Financial" },
  { id: "8", name: "system_settings", description: "Access system configuration", category: "System" },
];

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full access to all academy features and settings",
    userCount: 1,
    permissions: ["1", "2", "3", "4", "5", "6", "7", "8"],
    isSystem: true
  },
  {
    id: "2",
    name: "Admin",
    description: "Manage users, classes, and view reports",
    userCount: 3,
    permissions: ["1", "3", "4", "5", "6", "7"],
    isSystem: true
  },
  {
    id: "3",
    name: "Coach",
    description: "Manage assigned classes and students",
    userCount: 12,
    permissions: ["4", "5"],
    isSystem: true
  },
  {
    id: "4",
    name: "Student",
    description: "Basic access to student portal",
    userCount: 156,
    permissions: [],
    isSystem: true
  }
];

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getPermissionsByCategory = () => {
    const categories = mockPermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
    return categories;
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.permissions.includes(permissionId) || false;
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(prevRoles => 
      prevRoles.map(role => {
        if (role.id === roleId) {
          const newPermissions = role.permissions.includes(permissionId)
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId];
          return { ...role, permissions: newPermissions };
        }
        return role;
      })
    );
  };

  const permissionCategories = getPermissionsByCategory();

  return (
    <div className="space-y-6">
      {/* Roles Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Academy Roles
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role-name">Role Name</Label>
                    <Input id="role-name" placeholder="Enter role name" />
                  </div>
                  <div>
                    <Label htmlFor="role-description">Description</Label>
                    <Input id="role-description" placeholder="Describe this role" />
                  </div>
                  <Button className="w-full">Create Role</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => (
              <div key={role.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-bjj-navy">{role.name}</h4>
                  {role.isSystem && (
                    <Badge variant="outline" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" />
                      System
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {role.userCount} users
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedRole(role);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Role Permissions Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(permissionCategories).map(([category, permissions]) => (
              <div key={category} className="space-y-3">
                <h4 className="font-medium text-bjj-navy border-b pb-2">{category}</h4>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium">{permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h5>
                        <p className="text-sm text-gray-600">{permission.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {roles.map((role) => (
                          <div key={role.id} className="text-center">
                            <div className="text-xs text-gray-500 mb-1">{role.name}</div>
                            <Switch
                              checked={hasPermission(role.id, permission.id)}
                              onCheckedChange={() => togglePermission(role.id, permission.id)}
                              disabled={role.isSystem}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role: {selectedRole?.name}</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-role-name">Role Name</Label>
                  <Input 
                    id="edit-role-name" 
                    defaultValue={selectedRole.name}
                    disabled={selectedRole.isSystem}
                  />
                </div>
                <div>
                  <Label>User Count</Label>
                  <Input value={`${selectedRole.userCount} users`} disabled />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-role-description">Description</Label>
                <Input 
                  id="edit-role-description" 
                  defaultValue={selectedRole.description}
                  disabled={selectedRole.isSystem}
                />
              </div>
              <div className="space-y-3">
                <Label>Permissions</Label>
                {Object.entries(permissionCategories).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h5 className="font-medium text-sm">{category}</h5>
                    <div className="space-y-2 pl-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                            <div className="text-xs text-gray-500">{permission.description}</div>
                          </div>
                          <Switch
                            checked={hasPermission(selectedRole.id, permission.id)}
                            onCheckedChange={() => togglePermission(selectedRole.id, permission.id)}
                            disabled={selectedRole.isSystem}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
                  disabled={selectedRole.isSystem}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
