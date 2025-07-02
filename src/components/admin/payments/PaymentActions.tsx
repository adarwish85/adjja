
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { usePayments } from "@/hooks/usePayments";
import { CreditCard, Plus } from "lucide-react";

export const PaymentActions = () => {
  const [amount, setAmount] = useState("49.99");
  const [productType, setProductType] = useState("course");
  const [subscriptionTier, setSubscriptionTier] = useState("basic");
  const { createCheckoutSession, createSubscription, isLoading } = usePayments();

  const handleOneTimePayment = async () => {
    const amountInCents = Math.round(parseFloat(amount) * 100);
    await createCheckoutSession(amountInCents, productType);
  };

  const handleSubscription = async () => {
    await createSubscription(subscriptionTier, subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* One-time Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Create One-time Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (EGP)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="49.99"
            />
          </div>
          <div>
            <Label htmlFor="product-type">Product Type</Label>
            <Select value={productType} onValueChange={setProductType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="merchandise">Merchandise</SelectItem>
                <SelectItem value="service">Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleOneTimePayment}
            disabled={isLoading}
            className="w-full bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Payment Link
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Create Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subscription-tier">Subscription Tier</Label>
            <Select value={subscriptionTier} onValueChange={setSubscriptionTier}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic - EGP 199.99/month</SelectItem>
                <SelectItem value="premium">Premium - EGP 499.99/month</SelectItem>
                <SelectItem value="enterprise">Enterprise - EGP 999.99/month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleSubscription}
            disabled={isLoading}
            className="w-full bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Subscription Link
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
