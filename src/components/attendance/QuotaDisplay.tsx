
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface QuotaDisplayProps {
  quota: {
    remaining_classes: number;
    total_classes?: number;
    used_classes?: number;
    is_unlimited: boolean;
  } | null;
  compact?: boolean;
}

export const QuotaDisplay = ({ quota, compact = false }: QuotaDisplayProps) => {
  if (!quota) return null;

  const isLow = !quota.is_unlimited && quota.remaining_classes <= 2;
  const isOut = !quota.is_unlimited && quota.remaining_classes <= 0;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {isOut ? (
          <AlertTriangle className="h-4 w-4 text-red-500" />
        ) : isLow ? (
          <Clock className="h-4 w-4 text-orange-500" />
        ) : (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
        <span className="text-sm font-medium">
          {quota.is_unlimited ? 'Unlimited' : `${quota.remaining_classes} left`}
        </span>
      </div>
    );
  }

  return (
    <Card className={`${
      isOut 
        ? 'border-red-200 bg-red-50' 
        : isLow 
        ? 'border-orange-200 bg-orange-50' 
        : 'border-green-200 bg-green-50'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Class Credits</h3>
          <Badge variant={isOut ? "destructive" : isLow ? "secondary" : "default"}>
            {quota.is_unlimited ? '∞' : quota.remaining_classes}
          </Badge>
        </div>
        
        {!quota.is_unlimited && (
          <>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Used: {quota.used_classes}</span>
              <span>Total: {quota.total_classes}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isOut ? 'bg-red-500' : isLow ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{
                  width: `${Math.min(100, ((quota.used_classes || 0) / (quota.total_classes || 1)) * 100)}%`
                }}
              />
            </div>
            
            {isOut && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                No classes remaining. Please renew your subscription.
              </p>
            )}
            
            {isLow && !isOut && (
              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Running low on classes. Consider upgrading your plan.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
