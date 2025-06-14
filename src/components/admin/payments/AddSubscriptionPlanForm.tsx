
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useAppSettings } from "@/contexts/SettingsContext";

interface AddSubscriptionPlanFormProps {
  onClose: () => void;
}

export const AddSubscriptionPlanForm = ({ onClose }: AddSubscriptionPlanFormProps) => {
  const { currency } = useAppSettings();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    number_of_classes: "",
    subscription_period: "",
    standard_price: "",
    sale_price: "",
    is_active: true,
  });

  const { createPlan } = useSubscriptionPlans();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      console.error("Title is required");
      return;
    }
    
    if (!formData.subscription_period) {
      console.error("Subscription period is required");
      return;
    }
    
    if (!formData.number_of_classes || parseInt(formData.number_of_classes) < 1) {
      console.error("Number of classes must be at least 1");
      return;
    }
    
    if (!formData.standard_price || parseFloat(formData.standard_price) <= 0) {
      console.error("Standard price must be greater than 0");
      return;
    }
    
    try {
      console.log("Creating subscription plan with data:", formData);
      
      await createPlan.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        number_of_classes: parseInt(formData.number_of_classes),
        subscription_period: formData.subscription_period as "weekly" | "monthly" | "quarterly" | "yearly",
        standard_price: parseFloat(formData.standard_price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        is_active: formData.is_active,
      });
      
      console.log("Subscription plan created successfully");
      onClose();
    } catch (error) {
      console.error("Error creating subscription plan:", error);
    }
  };

  const getCurrencySymbol = () => {
    switch (currency?.toLowerCase()) {
      case 'usd': return '$';
      case 'eur': return '€';
      case 'gbp': return '£';
      case 'egp': return 'LE';
      default: return '$';
    }
  };

  const getCurrencyName = () => {
    switch (currency?.toLowerCase()) {
      case 'usd': return 'USD';
      case 'eur': return 'EUR';
      case 'gbp': return 'GBP';
      case 'egp': return 'EGP';
      default: return 'USD';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-bjj-navy">Add New Subscription Plan</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Plan Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Basic - 8 Classes/Month"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Billing Period *</Label>
              <Select 
                value={formData.subscription_period} 
                onValueChange={(value) => setFormData({ ...formData, subscription_period: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this subscription plan..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classes">Number of Classes *</Label>
              <Input
                id="classes"
                type="number"
                value={formData.number_of_classes}
                onChange={(e) => setFormData({ ...formData, number_of_classes: e.target.value })}
                placeholder="8 (or 999 for unlimited)"
                required
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standard_price">Standard Price ({getCurrencySymbol()}) *</Label>
              <Input
                id="standard_price"
                type="number"
                step="0.01"
                value={formData.standard_price}
                onChange={(e) => setFormData({ ...formData, standard_price: e.target.value })}
                placeholder="89.99"
                required
                min="0.01"
              />
              <p className="text-xs text-gray-500">Currency: {getCurrencyName()}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_price">Sale Price ({getCurrencySymbol()}) - Optional</Label>
              <Input
                id="sale_price"
                type="number"
                step="0.01"
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                placeholder="79.99"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Plan is active</Label>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Button
              type="submit"
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
              disabled={createPlan.isPending}
            >
              {createPlan.isPending ? "Creating..." : "Create Plan"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
