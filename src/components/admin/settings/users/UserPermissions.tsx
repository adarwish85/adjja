
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  UserCheck, 
  Search, 
  Shield,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useUserPermissions } from "@/hooks/useUserPermissions";

const permissionCategories = {
  "User Management": ["manage_users", "manage_roles"],
  "Classes": ["manage_classes", "manage_students"],
  "Analytics": ["view_analytics"],
  "System": ["system_settings"]
};

export const UserPermissions = () => {
  const { userPermissions, isLoading, toggleUserPermission } = useUserPermissions();
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = userPermissions.filter(user => {
    const matchesSearch = user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = selectedUser === "all" || user.userId === selectedUser;
    return matchesSearch && matchesUser;
  });

  const getPermissionStatus = (permission: any) => {
    if (!permission?.granted) return { status: "denied", color: "bg-red-100 text-red-800" };
    if (permission.expiresAt) {
      const expiryDate = new Date(permission.expiresAt);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      
      if (daysUntilExpiry <= 0) return { status: "expired", color: "bg-red-100 text-red-800" };
      if (daysUntilExpiry <= 30) return { status: "expiring", color: "bg-yellow-100 text-yellow-800" };
    }
    return { status: "granted", color: "bg-green-100 text-green-800" };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading permissions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Permissions Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            User Permissions Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {userPermissions.map(user => (
                  <SelectItem key={user.userId} value={user.userId}>
                    {user.userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {filteredUsers.map((user) => (
              <div key={user.userId} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user.userName} />
                      <AvatarFallback>
                        {user.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-bjj-navy">{user.userName}</h4>
                      <p className="text-sm text-gray-600">{user.userEmail}</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {user.role}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {Object.entries(permissionCategories).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h5 className="font-medium text-sm text-bjj-navy border-b pb-1">
                        {category}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {permissions.map((permission) => {
                          const userPermission = user.permissions[permission];
                          const status = getPermissionStatus(userPermission);
                          
                          return (
                            <div key={permission} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">
                                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                  <Badge className={status.color}>
                                    {status.status}
                                  </Badge>
                                </div>
                                {userPermission?.granted && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    <div>Granted by: {userPermission.grantedBy}</div>
                                    <div>Date: {userPermission.grantedAt}</div>
                                    {userPermission.expiresAt && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Expires: {userPermission.expiresAt}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {status.status === "expiring" && (
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                )}
                                <Switch
                                  checked={userPermission?.granted || false}
                                  onCheckedChange={() => toggleUserPermission(user.userId, permission)}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permission Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {userPermissions.reduce((acc, user) => 
                  acc + Object.values(user.permissions).filter(p => p.granted).length, 0
                )}
              </div>
              <div className="text-sm text-gray-600">Active Permissions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">Expiring Soon</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-gray-600">Expired</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {userPermissions.reduce((acc, user) => 
                  acc + Object.values(user.permissions).filter(p => !p.granted).length, 0
                )}
              </div>
              <div className="text-sm text-gray-600">Denied</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
