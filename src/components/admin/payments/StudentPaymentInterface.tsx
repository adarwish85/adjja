
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Clock, CheckCircle, AlertCircle, DollarSign } from "lucide-react";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { usePayPalPayments } from "@/hooks/usePayPalPayments";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethods } from "./PaymentMethods";
import { useAppSettings } from "@/contexts/SettingsContext";

interface StudentPaymentInterfaceProps {
  studentId: string;
}

export const StudentPaymentInterface = ({ studentId }: StudentPaymentInterfaceProps) => {
  const { toast } = useToast();
  const { currency } = useAppSettings();
  const { subscriptionPlans, isLoading: plansLoading } = useSubscriptionPlans();
  const { createPayPalOrder, isLoading: paymentLoading } = usePayPalPayments();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Get currency symbol for display
  const getCurrencySymbol = (currencyCode: string) => {
    const currencyMap: Record<string, string> = {
      'egp': 'LE',
      'usd': '$',
      'eur': '€',
      'gbp': '£',
      'aed': 'AED',
      'sar': 'SR',
    };
    return currencyMap[currencyCode.toLowerCase()] || currencyCode.toUpperCase();
  };

  const currencySymbol = getCurrencySymbol(currency);

  // Format price with currency
  const formatPrice = (price: number) => {
    return `${currencySymbol} ${price.toFixed(2)}`;
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setSelectedPlan(planId);
      
      const selectedPlanData = subscriptionPlans?.find(plan => plan.id === planId);
      if (!selectedPlanData) return;

      const result = await createPayPalOrder(
        selectedPlanData.standard_price,
        studentId,
        planId
      );

      if (result.approvalUrl) {
        // Open PayPal checkout in a new tab
        window.open(result.approvalUrl, '_blank');
        
        toast({
          title: "Redirecting to PayPal",
          description: "Complete your payment to activate the subscription.",
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSelectedPlan(null);
    }
  };

  if (plansLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-6 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-8 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Currency Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              All prices are displayed in <strong>{currency.toUpperCase()}</strong> ({getCurrencySymbol(currency)})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptionPlans?.map((plan) => (
          <Card key={plan.id} className="relative hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-bjj-navy">{plan.title}</CardTitle>
              <p className="text-sm text-bjj-gray">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-bjj-navy">
                  {formatPrice(plan.standard_price)}
                </div>
                <p className="text-sm text-bjj-gray">per {plan.subscription_period}</p>
                {plan.sale_price && plan.sale_price < plan.standard_price && (
                  <div className="mt-2">
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      Sale: {formatPrice(plan.sale_price)}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{plan.number_of_classes} classes per {plan.subscription_period}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Access to all BJJ programs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Equipment included</span>
                </div>
              </div>

              <Button 
                className="w-full bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy font-semibold"
                onClick={() => handleSubscribe(plan.id)}
                disabled={paymentLoading && selectedPlan === plan.id}
              >
                {paymentLoading && selectedPlan === plan.id ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Methods */}
      <PaymentMethods />
    </div>
  );
};
