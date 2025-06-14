
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PaymentTransaction {
  id: string;
  student_id: string;
  subscription_plan_id: string | null;
  amount: number;
  paypal_transaction_id: string | null;
  paypal_order_id: string | null;
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  transaction_date: string;
  created_at: string;
  updated_at: string;
  students?: {
    name: string;
    email: string;
  };
  subscription_plans?: {
    title: string;
  };
}

export const usePaymentTransactions = (studentId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["payment-transactions", studentId],
    queryFn: async () => {
      let query = supabase
        .from("payment_transactions")
        .select(`
          *,
          students!inner(name, email),
          subscription_plans(title)
        `)
        .order("transaction_date", { ascending: false });

      if (studentId) {
        query = query.eq("student_id", studentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PaymentTransaction[];
    },
  });

  const updateTransactionStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentTransaction["status"] }) => {
      const { data, error } = await supabase
        .from("payment_transactions")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-transactions"] });
      toast({
        title: "Success",
        description: "Transaction status updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update transaction status.",
        variant: "destructive",
      });
    },
  });

  return {
    transactions,
    isLoading,
    updateTransactionStatus,
  };
};
