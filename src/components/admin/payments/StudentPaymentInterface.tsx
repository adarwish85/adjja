
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Check, Star, Users, Clock } from "lucide-react";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { usePayPalPayments } from "@/hooks/usePayPalPayments";
import { useToast } from "@/hooks/use-toast";

interface StudentPaymentInterfaceProps {
  studentId: string;
}

export const StudentPaymentInterface = ({ studentId }: StudentPaymentInterfaceProps) => {
  const { activeSubscriptionPlans, isLoading } = useSubscriptionPlans();
  const { createPayPalOrder, isLoading: paymentLoading } = usePayPalPayments();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string, amount: number) => {
    try {
      setSelectedPlan(planId);
      const result = await createPayPalOrder(amount, studentId, planId);
      
      if (result.approvalUrl) {
        window.location.href = result.approvalUrl;
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to initiate PayPal payment",
        variant: "destructive",
      });
    } finally {
      setSelectedPlan(null);
    }
  };

  const getPlanBadge = (period: string) => {
    switch (period) {
      case 'weekly': return { text: 'Weekly', color: 'bg-blue-100 text-blue-800' };
      case 'monthly': return { text: 'Monthly', color: 'bg-green-100 text-green-800' };
      case 'quarterly': return { text: 'Quarterly', color: 'bg-purple-100 text-purple-800' };
      case 'yearly': return { text: 'Yearly', color: 'bg-orange-100 text-orange-800' };
      default: return { text: 'Monthly', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getPlanIcon = (classCount: number) => {
    if (classCount <= 8) return <Users className="h-5 w-5 text-bjj-gold" />;
    if (classCount <= 16) return <Star className="h-5 w-5 text-bjj-gold" />;
    return <Check className="h-5 w-5 text-bjj-gold" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-bjj-navy">Choose Your Training Plan</h2>
        <p className="text-bjj-gray">Select a subscription plan that fits your training goals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeSubscriptionPlans?.map((plan) => {
          const badge = getPlanBadge(plan.subscription_period);
          const isPopular = plan.number_of_classes === 16;
          const currentPrice = plan.sale_price || plan.standard_price;
          const hasDiscount = plan.sale_price && plan.sale_price < plan.standard_price;
          
          return (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-200 hover:shadow-lg ${
                isPopular ? 'ring-2 ring-bjj-gold shadow-lg' : ''
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-bjj-gold text-bjj-navy px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  {getPlanIcon(plan.number_of_classes)}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-bjj-navy">{plan.title}</h3>
                  {plan.description && (
                    <p className="text-sm text-bjj-gray mt-1">{plan.description}</p>
                  )}
                </div>

                <Badge className={badge.color} variant="outline">
                  {badge.text}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-3xl font-bold text-bjj-navy">
                      ${currentPrice.toFixed(0)}
                    </span>
                    {hasDiscount && (
                      <span className="text-lg text-gray-500 line-through">
                        ${plan.standard_price.toFixed(0)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-bjj-gray">per {plan.subscription_period.replace('ly', '')}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-bjj-gold" />
                    <span className="text-sm">
                      {plan.number_of_classes === 999 
                        ? 'Unlimited classes' 
                        : `${plan.number_of_classes} classes per ${plan.subscription_period.replace('ly', '')}`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Access to all programs</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Equipment provided</span>
                  </div>

                  {plan.number_of_classes >= 16 && (
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Priority booking</span>
                    </div>
                  )}
                </div>

                <Button
                  className={`w-full ${
                    isPopular 
                      ? 'bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy' 
                      : 'bg-bjj-navy hover:bg-bjj-navy/90 text-white'
                  }`}
                  onClick={() => handleSelectPlan(plan.id, currentPrice)}
                  disabled={paymentLoading || selectedPlan === plan.id}
                >
                  {selectedPlan === plan.id ? (
                    "Processing..."
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Choose Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-bjj-gray">
        <p>All payments are processed securely through PayPal</p>
        <p>You can cancel or modify your subscription at any time</p>
      </div>
    </div>
  );
};
