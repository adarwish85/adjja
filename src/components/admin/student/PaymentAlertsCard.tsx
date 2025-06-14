
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudents } from "@/hooks/useStudents";
import { AlertTriangle, Bell, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PaymentAlertsCard = () => {
  const { students, loading } = useStudents();

  const getPaymentAlerts = () => {
    if (!students) return { dueSoon: [], overdue: [] };
    
    return {
      dueSoon: students.filter(s => s.payment_status === 'due_soon'),
      overdue: students.filter(s => s.payment_status === 'overdue')
    };
  };

  const { dueSoon, overdue } = getPaymentAlerts();

  const handleRunPaymentReminders = async () => {
    try {
      toast.info("Running payment reminder process...");
      
      const { data, error } = await supabase.functions.invoke('payment-reminders');
      
      if (error) {
        console.error('Error running payment reminders:', error);
        toast.error("Failed to run payment reminders");
        return;
      }
      
      console.log('Payment reminders result:', data);
      toast.success(`Payment reminders sent successfully. ${data.summary?.notifications_created || 0} notifications created.`);
      
    } catch (error) {
      console.error('Error invoking payment reminders:', error);
      toast.error("Failed to run payment reminders");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Payment Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading payment data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Payment Alerts</span>
          </div>
          <Button 
            onClick={handleRunPaymentReminders}
            size="sm" 
            variant="outline"
            className="flex items-center space-x-1"
          >
            <Bell className="h-4 w-4" />
            <span>Send Reminders</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Due Soon</span>
              <Badge variant="outline" className="text-yellow-600">
                {dueSoon.length}
              </Badge>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {dueSoon.length > 0 ? (
                dueSoon.map(student => (
                  <div key={student.id} className="text-sm text-gray-600">
                    {student.name} - Due: {student.next_due_date ? new Date(student.next_due_date).toLocaleDateString() : 'N/A'}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No payments due soon</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Overdue</span>
              <Badge variant="outline" className="text-red-600">
                {overdue.length}
              </Badge>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {overdue.length > 0 ? (
                overdue.map(student => (
                  <div key={student.id} className="text-sm text-gray-600">
                    {student.name} - Due: {student.next_due_date ? new Date(student.next_due_date).toLocaleDateString() : 'N/A'}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No overdue payments</p>
              )}
            </div>
          </div>
        </div>

        {(dueSoon.length > 0 || overdue.length > 0) && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              Click "Send Reminders" to notify students about their payment status.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
