
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePayments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (amount: number, productType: string, productId?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { amount, productType, productId }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      return data;
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to create checkout session",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (priceId: string, tier: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { priceId, tier }
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      return data;
    } catch (error) {
      toast({
        title: "Subscription Error",
        description: "Failed to create subscription",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify payment",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    createCheckoutSession,
    createSubscription,
    verifyPayment,
    isLoading
  };
};
