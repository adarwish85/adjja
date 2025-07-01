
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Shield, Users, Settings } from "lucide-react";

export const TwoFactorAuth = () => {
  const twoFAStats = [
    { label: "Total Users", value: "156", enabled: "132", percentage: "85%" },
    { label: "Admins", value: "8", enabled: "8", percentage: "100%" },
    { label: "Coaches", value: "24", enabled: "20", percentage: "83%" },
    { label: "Students", value: "124", enabled: "104", percentage: "84%" }
  ];

  return (
    <div className="space-y-6">
      {/* 2FA Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {twoFAStats.map((stat) => (
              <div key={stat.label} className="text-center p-4 border rounded-lg">
                <h3 className="font-medium text-bjj-navy">{stat.label}</h3>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-bjj-navy">{stat.enabled}</div>
                  <div className="text-sm text-bjj-gray">of {stat.value} users</div>
                  <Badge className="mt-1 bg-green-500">{stat.percentage}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2FA Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Two-Factor Authentication Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-2fa-admin" className="text-base font-medium">
                Require 2FA for Administrators
              </Label>
              <p className="text-sm text-bjj-gray">
                Force all administrators to use two-factor authentication
              </p>
            </div>
            <Switch id="require-2fa-admin" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-2fa-coaches" className="text-base font-medium">
                Require 2FA for Coaches
              </Label>
              <p className="text-sm text-bjj-gray">
                Force all coaches to use two-factor authentication
              </p>
            </div>
            <Switch id="require-2fa-coaches" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-sms-2fa" className="text-base font-medium">
                Allow SMS-based 2FA
              </Label>
              <p className="text-sm text-bjj-gray">
                Allow users to use SMS for two-factor authentication
              </p>
            </div>
            <Switch id="allow-sms-2fa" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-app-2fa" className="text-base font-medium">
                Allow App-based 2FA
              </Label>
              <p className="text-sm text-bjj-gray">
                Allow users to use authenticator apps (Google Authenticator, Authy)
              </p>
            </div>
            <Switch id="allow-app-2fa" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="backup-codes" className="text-base font-medium">
                Enable Backup Codes
              </Label>
              <p className="text-sm text-bjj-gray">
                Allow users to generate backup codes for 2FA recovery
              </p>
            </div>
            <Switch id="backup-codes" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">2FA Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-bjj-navy" />
                <div className="font-medium">Bulk Enable 2FA</div>
                <div className="text-xs text-bjj-gray">Force 2FA for user groups</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-bjj-navy" />
                <div className="font-medium">Reset 2FA</div>
                <div className="text-xs text-bjj-gray">Reset 2FA for users</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Smartphone className="h-6 w-6 mx-auto mb-2 text-bjj-navy" />
                <div className="font-medium">2FA Report</div>
                <div className="text-xs text-bjj-gray">Generate usage report</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
