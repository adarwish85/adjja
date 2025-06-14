
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
  status: "unpaid" | "paid" | "due_soon" | "overdue" | null;
  className?: string;
}

export const PaymentStatusBadge = ({ status, className }: PaymentStatusBadgeProps) => {
  const getStatusConfig = (status: string | null) => {
    switch (status) {
      case "paid":
        return {
          text: "Paid",
          className: "bg-green-100 text-green-800 hover:bg-green-100"
        };
      case "due_soon":
        return {
          text: "Due Soon",
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        };
      case "overdue":
        return {
          text: "Overdue",
          className: "bg-red-100 text-red-800 hover:bg-red-100"
        };
      case "unpaid":
        return {
          text: "Unpaid",
          className: "bg-gray-100 text-gray-800 hover:bg-gray-100"
        };
      default:
        return {
          text: "Unknown",
          className: "bg-gray-100 text-gray-800 hover:bg-gray-100"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={cn(config.className, className)}>
      {config.text}
    </Badge>
  );
};
