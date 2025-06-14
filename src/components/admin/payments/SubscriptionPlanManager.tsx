
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { AddSubscriptionPlanForm } from "./AddSubscriptionPlanForm";
import { EditSubscriptionPlanForm } from "./EditSubscriptionPlanForm";
import { useAppSettings } from "@/contexts/SettingsContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const SubscriptionPlanManager = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const { subscriptionPlans, isLoading, deletePlan } = useSubscriptionPlans();
  const { currency } = useAppSettings();

  const formatPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
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

  const formatPrice = (price: number) => {
    const symbol = getCurrencySymbol();
    return `${symbol}${price.toFixed(2)}`;
  };

  const getClassesDisplay = (classes: number) => {
    return classes === 999 ? "Unlimited" : `${classes} classes`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bjj-gold"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-bjj-navy">Subscription Plans</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {showAddForm && (
        <AddSubscriptionPlanForm onClose={() => setShowAddForm(false)} />
      )}

      {editingPlan && (
        <EditSubscriptionPlanForm
          planId={editingPlan}
          onClose={() => setEditingPlan(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptionPlans?.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-bjj-navy">{plan.title}</CardTitle>
                <Badge variant={plan.is_active ? "default" : "secondary"}>
                  {plan.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-bjj-gray text-sm">{plan.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-bjj-gray">Classes:</span>
                  <span className="font-medium">{getClassesDisplay(plan.number_of_classes)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-bjj-gray">Period:</span>
                  <span className="font-medium">{formatPeriod(plan.subscription_period)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-bjj-gray">Price:</span>
                  <div className="text-right">
                    {plan.sale_price && plan.sale_price < plan.standard_price ? (
                      <div>
                        <span className="font-bold text-green-600">{formatPrice(plan.sale_price)}</span>
                        <span className="text-xs text-gray-500 line-through ml-1">
                          {formatPrice(plan.standard_price)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold">{formatPrice(plan.standard_price)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPlan(plan.id)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{plan.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePlan.mutate(plan.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subscriptionPlans?.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-bjj-gray mx-auto mb-4" />
            <h3 className="text-lg font-medium text-bjj-navy mb-2">No Subscription Plans</h3>
            <p className="text-bjj-gray mb-4">Create your first subscription plan to get started.</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
