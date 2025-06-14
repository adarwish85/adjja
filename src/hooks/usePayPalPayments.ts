
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";

export const usePayPalPayments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { loadIntegrationSettings } = useSettings();

  const createPayPalOrder = async (amount: number, studentId: string, planId?: string) => {
    setIsLoading(true);
    try {
      const integrationSettings = loadIntegrationSettings();
      
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: { 
          amount: amount.toFixed(2), 
          currency: 'USD',
          studentId,
          planId,
          paypalConfig: {
            clientId: integrationSettings.paypalClientId,
            clientSecret: integrationSettings.paypalClientSecret,
            sandboxMode: integrationSettings.paypalSandboxMode
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to create PayPal order",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const capturePayPalOrder = async (orderId: string) => {
    setIsLoading(true);
    try {
      const integrationSettings = loadIntegrationSettings();
      
      const { data, error } = await supabase.functions.invoke('capture-paypal-order', {
        body: { 
          orderId,
          paypalConfig: {
            clientId: integrationSettings.paypalClientId,
            clientSecret: integrationSettings.paypalClientSecret,
            sandboxMode: integrationSettings.paypalSandboxMode
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to capture PayPal payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const recordManualPayment = async (studentId: string, amount: number, planId?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('record-manual-payment', {
        body: { studentId, amount, planId }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Manual payment recorded successfully",
      });
      
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record manual payment",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPayPalOrder,
    capturePayPalOrder,
    recordManualPayment,
    isLoading
  };
};
