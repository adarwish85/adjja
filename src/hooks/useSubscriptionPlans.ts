
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SubscriptionPlan {
  id: string;
  title: string;
  description: string | null;
  number_of_classes: number;
  subscription_period: "weekly" | "monthly" | "quarterly" | "yearly";
  standard_price: number;
  sale_price: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSubscriptionPlans = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptionPlans, isLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  const { data: activeSubscriptionPlans } = useQuery({
    queryKey: ["active-subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("standard_price", { ascending: true });

      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  const createPlan = useMutation({
    mutationFn: async (planData: Omit<SubscriptionPlan, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .insert([planData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["active-subscription-plans"] });
      toast({
        title: "Success",
        description: "Subscription plan created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create subscription plan.",
        variant: "destructive",
      });
    },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, ...planData }: { id: string } & Partial<SubscriptionPlan>) => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .update(planData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["active-subscription-plans"] });
      toast({
        title: "Success",
        description: "Subscription plan updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update subscription plan.",
        variant: "destructive",
      });
    },
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("subscription_plans")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["active-subscription-plans"] });
      toast({
        title: "Success",
        description: "Subscription plan deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete subscription plan.",
        variant: "destructive",
      });
    },
  });

  return {
    subscriptionPlans,
    activeSubscriptionPlans,
    isLoading,
    createPlan,
    updatePlan,
    deletePlan,
  };
};
