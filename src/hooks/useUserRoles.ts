import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  is_system: boolean;
  user_count: number;
  created_at: string;
  updated_at: string;
}

export const useUserRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching roles...');
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
      
      console.log('Roles fetched successfully:', data);
      setRoles(data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRole = async (roleData: {
    name: string;
    description: string;
    permissions: string[];
  }) => {
    try {
      console.log('Creating role with data:', roleData);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions,
          is_system: false,
          user_count: 0
        })
        .select();

      if (error) {
        console.error('Error creating role:', error);
        throw error;
      }

      console.log('Role created successfully:', data);
      await fetchRoles();
      toast({
        title: "Success",
        description: "Role created successfully",
      });
    } catch (error: any) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create role",
        variant: "destructive",
      });
    }
  };

  const updateRole = async (roleId: string, updates: Partial<UserRole>) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({
          name: updates.name,
          description: updates.description,
          permissions: updates.permissions
        })
        .eq('id', roleId);

      if (error) throw error;

      await fetchRoles();
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const deleteRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      await fetchRoles();
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    isLoading,
    createRole,
    updateRole,
    deleteRole,
    refetch: fetchRoles
  };
};
