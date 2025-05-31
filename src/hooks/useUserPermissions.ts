
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UserPermission {
  id: string;
  user_id: string;
  permission_name: string;
  granted: boolean;
  granted_by?: string;
  granted_at?: string;
  expires_at?: string;
}

export interface UserPermissionDetails {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  permissions: {
    [key: string]: {
      granted: boolean;
      grantedBy: string;
      grantedAt: string;
      expiresAt?: string;
    };
  };
}

export const useUserPermissions = () => {
  const [userPermissions, setUserPermissions] = useState<UserPermissionDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserPermissions = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users with their roles and permissions
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          user_roles:role_id (
            name,
            permissions
          )
        `);

      if (usersError) throw usersError;

      // Fetch individual user permissions
      const { data: permissions, error: permissionsError } = await supabase
        .from('user_permissions')
        .select('*');

      if (permissionsError) throw permissionsError;

      // Combine data
      const formattedData = users?.map(user => {
        const userPerms = permissions?.filter(p => p.user_id === user.id) || [];
        const permissionsObj: any = {};

        // Add role-based permissions
        const rolePermissions = user.user_roles?.permissions || [];
        rolePermissions.forEach(perm => {
          permissionsObj[perm] = {
            granted: true,
            grantedBy: "System",
            grantedAt: user.created_at || new Date().toISOString(),
          };
        });

        // Add individual permissions
        userPerms.forEach(perm => {
          permissionsObj[perm.permission_name] = {
            granted: perm.granted,
            grantedBy: perm.granted_by || "Unknown",
            grantedAt: perm.granted_at || "",
            expiresAt: perm.expires_at
          };
        });

        return {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          role: user.user_roles?.name || 'Student',
          permissions: permissionsObj
        };
      }) || [];

      setUserPermissions(formattedData);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user permissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserPermission = async (userId: string, permission: string) => {
    try {
      // Check if permission already exists
      const { data: existing } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('permission_name', permission)
        .single();

      if (existing) {
        // Update existing permission
        const { error } = await supabase
          .from('user_permissions')
          .update({
            granted: !existing.granted,
            granted_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new permission
        const { error } = await supabase
          .from('user_permissions')
          .insert({
            user_id: userId,
            permission_name: permission,
            granted: true,
            granted_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      await fetchUserPermissions();
      toast({
        title: "Success",
        description: "Permission updated successfully",
      });
    } catch (error) {
      console.error('Error updating permission:', error);
      toast({
        title: "Error",
        description: "Failed to update permission",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  return {
    userPermissions,
    isLoading,
    toggleUserPermission,
    refetch: fetchUserPermissions
  };
};
