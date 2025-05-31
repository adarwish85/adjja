
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentsOverview } from "@/components/admin/payments/PaymentsOverview";
import { TransactionManagement } from "@/components/admin/payments/TransactionManagement";
import { SubscriptionManagement } from "@/components/admin/payments/SubscriptionManagement";
import { PaymentMethods } from "@/components/admin/payments/PaymentMethods";
import { PaymentAnalytics } from "@/components/admin/payments/PaymentAnalytics";
import { PaymentSettings } from "@/components/admin/payments/PaymentSettings";

const AdminPayments = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-bjj-navy">Payment Management</h1>
          <p className="text-bjj-gray">Manage transactions, subscriptions, and revenue</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="methods">Methods</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PaymentsOverview />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionManagement />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionManagement />
          </TabsContent>

          <TabsContent value="methods">
            <PaymentMethods />
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
