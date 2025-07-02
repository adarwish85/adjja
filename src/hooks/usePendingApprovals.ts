
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  profile_picture_url?: string;
  created_at: string;
  approval_status: string;
  rejection_reason?: string;
  phone?: string;
  role_name?: string;
}

export const usePendingApprovals = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching pending users...');
      
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          phone,
          profile_picture_url,
          created_at,
          approval_status,
          rejection_reason,
          user_roles:role_id (
            name
          )
        `)
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending users:', error);
        throw error;
      }
      
      console.log('Pending users fetched:', data);
      
      const formattedUsers = data?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile_picture_url: user.profile_picture_url,
        created_at: user.created_at,
        approval_status: user.approval_status,
        rejection_reason: user.rejection_reason,
        role_name: user.user_roles?.name || 'Student'
      })) || [];

      setPendingUsers(formattedUsers);
    } catch (error: any) {
      console.error('Error fetching pending users:', error);
      toast({
        title: "Error",
        description: `Failed to fetch pending users: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      console.log('Approving user:', userId);
      
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.rpc('approve_user_profile', {
        p_user_id: userId,
        p_approved_by: currentUser.user.id
      });

      if (error) {
        console.error('Error approving user:', error);
        throw error;
      }

      console.log('User approved successfully');
      await fetchPendingUsers();
      
      toast({
        title: "Success",
        description: "User approved successfully",
      });
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: `Failed to approve user: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const rejectUser = async (userId: string, reason: string) => {
    try {
      console.log('Rejecting user:', userId, 'with reason:', reason);
      
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.rpc('reject_user_profile', {
        p_user_id: userId,
        p_rejected_by: currentUser.user.id,
        p_reason: reason
      });

      if (error) {
        console.error('Error rejecting user:', error);
        throw error;
      }

      console.log('User rejected successfully');
      await fetchPendingUsers();
      
      toast({
        title: "Success",
        description: "User rejected successfully",
      });
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Error",
        description: `Failed to reject user: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  return {
    pendingUsers,
    isLoading,
    approveUser,
    rejectUser,
    refetch: fetchPendingUsers
  };
};
