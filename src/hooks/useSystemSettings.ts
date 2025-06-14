
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SystemSetting {
  id: string;
  category: string;
  key: string;
  value: any;
  branch_id?: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export const useSystemSettings = (category?: string, branchId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['system-settings', category, branchId],
    queryFn: async () => {
      let query = supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true })
        .order('key', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      if (branchId) {
        query = query.eq('branch_id', branchId);
      } else {
        query = query.is('branch_id', null);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as SystemSetting[];
    }
  });

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ category, key, value, branchId }: {
      category: string;
      key: string;
      value: any;
      branchId?: string;
    }) => {
      const { data, error } = await supabase.rpc('update_setting', {
        p_category: category,
        p_key: key,
        p_value: JSON.stringify(value),
        p_branch_id: branchId || null
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    }
  });

  // Get setting value with fallback
  const getSettingValue = async (category: string, key: string, defaultValue?: any, branchId?: string) => {
    try {
      const { data, error } = await supabase.rpc('get_setting_value', {
        p_category: category,
        p_key: key,
        p_branch_id: branchId || null
      });

      if (error) throw error;
      
      if (data !== null) {
        return typeof data === 'string' ? JSON.parse(data) : data;
      }
      
      return defaultValue;
    } catch (error) {
      console.error('Error getting setting value:', error);
      return defaultValue;
    }
  };

  // Update setting helper
  const updateSetting = async (category: string, key: string, value: any, branchId?: string) => {
    return updateSettingMutation.mutateAsync({ category, key, value, branchId });
  };

  // Organize settings by category
  const settingsByCategory = settings?.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = {};
    }
    acc[setting.category][setting.key] = setting.value;
    return acc;
  }, {} as Record<string, Record<string, any>>) || {};

  return {
    settings,
    settingsByCategory,
    isLoading,
    error,
    updateSetting,
    getSettingValue,
    isUpdating: updateSettingMutation.isPending
  };
};
