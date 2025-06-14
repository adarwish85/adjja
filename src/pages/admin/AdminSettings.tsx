
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { UsersSettings } from "@/components/admin/settings/UsersSettings";
import { SystemSettings } from "@/components/admin/settings/SystemSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { IntegrationSettings } from "@/components/admin/settings/IntegrationSettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { BackupSettings } from "@/components/admin/settings/BackupSettings";
import { CentralizedSettings } from "@/components/admin/settings/CentralizedSettings";

const AdminSettings = () => {
  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-bjj-navy">Academy Settings</h1>
          <p className="text-bjj-gray">Manage academy configuration and preferences</p>
        </div>

        <Tabs defaultValue="centralized" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="centralized">Centralized</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="centralized">
            <CentralizedSettings />
          </TabsContent>

          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="users">
            <UsersSettings />
          </TabsContent>

          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationSettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="backup">
            <BackupSettings />
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminSettings;
