
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { PaymentTransaction, usePaymentTransactions } from "@/hooks/usePaymentTransactions";

interface PaymentTransactionRowProps {
  transaction: PaymentTransaction;
}

export const PaymentTransactionRow = ({ transaction }: PaymentTransactionRowProps) => {
  const { updateTransactionStatus } = usePaymentTransactions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      case "refunded": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (newStatus: PaymentTransaction["status"]) => {
    updateTransactionStatus.mutate({
      id: transaction.id,
      status: newStatus
    });
  };

  const openPayPalTransaction = () => {
    if (transaction.paypal_transaction_id) {
      // PayPal sandbox or live transaction URL
      const paypalUrl = `https://www.sandbox.paypal.com/activity/payment/${transaction.paypal_transaction_id}`;
      window.open(paypalUrl, '_blank');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="font-semibold text-bjj-navy">{transaction.students?.name}</h4>
                <p className="text-sm text-bjj-gray">{transaction.students?.email}</p>
              </div>
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-bjj-gray">Date:</span>
                <p className="font-medium">{new Date(transaction.transaction_date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-bjj-gray">Amount:</span>
                <p className="font-medium">${transaction.amount.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-bjj-gray">Plan:</span>
                <p className="font-medium">{transaction.subscription_plans?.title || "Manual Payment"}</p>
              </div>
              <div>
                <span className="text-bjj-gray">PayPal ID:</span>
                <p className="font-medium text-xs">{transaction.paypal_transaction_id || "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              value={transaction.status}
              onValueChange={handleStatusChange}
              disabled={updateTransactionStatus.isPending}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            
            {transaction.paypal_transaction_id && (
              <Button
                variant="outline"
                size="sm"
                onClick={openPayPalTransaction}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
