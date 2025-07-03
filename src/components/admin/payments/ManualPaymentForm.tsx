
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DollarSign } from "lucide-react";

interface ManualPaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentRecorded?: () => void;
}

export const ManualPaymentForm = ({ open, onOpenChange, onPaymentRecorded }: ManualPaymentFormProps) => {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all active students
  const { data: students } = useQuery({
    queryKey: ['students-for-payment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, email')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: open
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !amount || !paymentMethod) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Record the payment transaction
      const { error } = await supabase
        .from('payment_transactions')
        .insert({
          student_id: selectedStudent,
          amount: parseFloat(amount),
          status: 'completed',
          transaction_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Payment recorded successfully!");
      
      // Reset form
      setSelectedStudent("");
      setAmount("");
      setPaymentMethod("");
      setNotes("");
      
      // Close modal and trigger refresh
      onOpenChange(false);
      onPaymentRecorded?.();
      
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error("Failed to record payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Record Manual Payment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="student">Student *</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students?.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="payment-method">Payment Method *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-bjj-red hover:bg-bjj-red/90"
            >
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
