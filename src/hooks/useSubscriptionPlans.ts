
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
      console.log("Fetching subscription plans...");
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;
      }
      
      console.log("Fetched subscription plans:", data);
      return data as SubscriptionPlan[];
    },
  });

  const { data: activeSubscriptionPlans } = useQuery({
    queryKey: ["active-subscription-plans"],
    queryFn: async () => {
      console.log("Fetching active subscription plans...");
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("standard_price", { ascending: true });

      if (error) {
        console.error("Error fetching active subscription plans:", error);
        throw error;
      }
      
      console.log("Fetched active subscription plans:", data);
      return data as SubscriptionPlan[];
    },
  });

  const createPlan = useMutation({
    mutationFn: async (planData: Omit<SubscriptionPlan, "id" | "created_at" | "updated_at">) => {
      console.log("Creating subscription plan:", planData);
      
      // Validate the data before sending
      if (!planData.title?.trim()) {
        throw new Error("Plan title is required");
      }
      
      if (!planData.subscription_period) {
        throw new Error("Subscription period is required");
      }
      
      if (!planData.number_of_classes || planData.number_of_classes < 1) {
        throw new Error("Number of classes must be at least 1");
      }
      
      if (!planData.standard_price || planData.standard_price <= 0) {
        throw new Error("Standard price must be greater than 0");
      }

      const { data, error } = await supabase
        .from("subscription_plans")
        .insert([planData])
        .select()
        .single();

      if (error) {
        console.error("Supabase error creating plan:", error);
        throw new Error(`Failed to create subscription plan: ${error.message}`);
      }
      
      console.log("Plan created successfully:", data);
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
    onError: (error: Error) => {
      console.error("Error creating subscription plan:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription plan.",
        variant: "destructive",
      });
    },
  });

  const updatePlan = useMutation({
    mutationFn: async ({ id, ...planData }: { id: string } & Partial<SubscriptionPlan>) => {
      console.log("Updating subscription plan:", id, planData);
      
      const { data, error } = await supabase
        .from("subscription_plans")
        .update(planData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error updating plan:", error);
        throw new Error(`Failed to update subscription plan: ${error.message}`);
      }
      
      console.log("Plan updated successfully:", data);
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
    onError: (error: Error) => {
      console.error("Error updating subscription plan:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription plan.",
        variant: "destructive",
      });
    },
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting subscription plan:", id);
      
      const { error } = await supabase
        .from("subscription_plans")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Supabase error deleting plan:", error);
        throw new Error(`Failed to delete subscription plan: ${error.message}`);
      }
      
      console.log("Plan deleted successfully");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["active-subscription-plans"] });
      toast({
        title: "Success",
        description: "Subscription plan deleted successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting subscription plan:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscription plan.",
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
