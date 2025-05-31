
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersList } from "./users/UsersList";
import { RoleManagement } from "./users/RoleManagement";
import { UserPermissions } from "./users/UserPermissions";
import { UserActivity } from "./users/UserActivity";
import { UserManagement as UserRegistrationSettings } from "./UserManagement";

export const UsersSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-bjj-navy">Users Management</h2>
          <p className="text-bjj-gray">Manage academy users, roles, permissions, and activity</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersList />
        </TabsContent>

        <TabsContent value="roles">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="permissions">
          <UserPermissions />
        </TabsContent>

        <TabsContent value="activity">
          <UserActivity />
        </TabsContent>

        <TabsContent value="registration">
          <UserRegistrationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
