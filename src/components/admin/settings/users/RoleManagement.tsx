
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
  Users,
  Settings,
  Lock
} from "lucide-react";
import { useUserRoles } from "@/hooks/useUserRoles";

const availablePermissions = [
  { id: "manage_users", name: "Manage Users", description: "Create, edit, and delete users", category: "User Management" },
  { id: "manage_roles", name: "Manage Roles", description: "Create and modify user roles", category: "User Management" },
  { id: "view_analytics", name: "View Analytics", description: "Access analytics and reports", category: "Analytics" },
  { id: "manage_classes", name: "Manage Classes", description: "Create and manage classes", category: "Classes" },
  { id: "manage_students", name: "Manage Students", description: "Manage student records", category: "Students" },
  { id: "manage_coaches", name: "Manage Coaches", description: "Manage coach profiles", category: "Coaches" },
  { id: "manage_payments", name: "Manage Payments", description: "Process and view payments", category: "Financial" },
  { id: "system_settings", name: "System Settings", description: "Access system configuration", category: "System" },
];

export const RoleManagement = () => {
  const { roles, isLoading, createRole, updateRole } = useUserRoles();
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState({ name: "", description: "", permissions: [] as string[] });

  const getPermissionsByCategory = () => {
    const categories = availablePermissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<string, typeof availablePermissions>);
    return categories;
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.permissions.includes(permissionId) || false;
  };

  const togglePermission = async (roleId: string, permissionId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role || role.is_system) return;

    const newPermissions = role.permissions.includes(permissionId)
      ? role.permissions.filter(p => p !== permissionId)
      : [...role.permissions, permissionId];

    await updateRole(roleId, { permissions: newPermissions });
  };

  const handleCreateRole = async () => {
    if (!newRole.name || !newRole.description) return;
    
    await createRole(newRole);
    setNewRole({ name: "", description: "", permissions: [] });
    setIsCreateDialogOpen(false);
  };

  const handleEditRole = async () => {
    if (!selectedRole) return;
    
    await updateRole(selectedRole.id, {
      name: selectedRole.name,
      description: selectedRole.description,
      permissions: selectedRole.permissions
    });
    setIsEditDialogOpen(false);
  };

  const permissionCategories = getPermissionsByCategory();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading roles...</div>
        </CardContent>
      </Card>
    );
  }

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
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                    <Input 
                      id="role-name" 
                      placeholder="Enter role name"
                      value={newRole.name}
                      onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role-description">Description</Label>
                    <Input 
                      id="role-description" 
                      placeholder="Describe this role"
                      value={newRole.description}
                      onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <Button className="w-full" onClick={handleCreateRole}>
                    Create Role
                  </Button>
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
                  {role.is_system && (
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
                    {role.user_count} users
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
                        <h5 className="font-medium">{permission.name}</h5>
                        <p className="text-sm text-gray-600">{permission.description}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {roles.map((role) => (
                          <div key={role.id} className="text-center">
                            <div className="text-xs text-gray-500 mb-1">{role.name}</div>
                            <Switch
                              checked={hasPermission(role.id, permission.id)}
                              onCheckedChange={() => togglePermission(role.id, permission.id)}
                              disabled={role.is_system}
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
                    value={selectedRole.name}
                    onChange={(e) => setSelectedRole(prev => ({ ...prev, name: e.target.value }))}
                    disabled={selectedRole.is_system}
                  />
                </div>
                <div>
                  <Label>User Count</Label>
                  <Input value={`${selectedRole.user_count} users`} disabled />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-role-description">Description</Label>
                <Input 
                  id="edit-role-description" 
                  value={selectedRole.description}
                  onChange={(e) => setSelectedRole(prev => ({ ...prev, description: e.target.value }))}
                  disabled={selectedRole.is_system}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
                  onClick={handleEditRole}
                  disabled={selectedRole.is_system}
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
