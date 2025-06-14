
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentsOverview } from "@/components/admin/payments/PaymentsOverview";
import { SubscriptionPlanManager } from "@/components/admin/payments/SubscriptionPlanManager";
import { PayPalPaymentDashboard } from "@/components/admin/payments/PayPalPaymentDashboard";
import { PaymentAnalytics } from "@/components/admin/payments/PaymentAnalytics";
import { PaymentSettings } from "@/components/admin/payments/PaymentSettings";

const AdminPayments = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-bjj-navy">Payment Management</h1>
          <p className="text-bjj-gray">Manage PayPal payments, subscriptions, and revenue</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PaymentsOverview />
          </TabsContent>

          <TabsContent value="plans">
            <SubscriptionPlanManager />
          </TabsContent>

          <TabsContent value="transactions">
            <PayPalPaymentDashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <PaymentAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <PaymentSettings />
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminPayments;
