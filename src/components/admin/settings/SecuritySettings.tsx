
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Lock, 
  Users, 
  Key,
  AlertTriangle,
  Settings
} from "lucide-react";
import { useSettings, SecuritySettings as SecuritySettingsType } from "@/hooks/useSettings";
import { SecurityDashboard } from "./security/SecurityDashboard";
import { TwoFactorAuth } from "./security/TwoFactorAuth";
import { SessionManagement } from "./security/SessionManagement";
import { SettingsErrorBoundary } from "./SettingsErrorBoundary";

export const SecuritySettings = () => {
  const { defaultSecuritySettings, saveSecuritySettings, generateAPIKey, isLoading } = useSettings();
  const [settings, setSettings] = useState<SecuritySettingsType>(defaultSecuritySettings);

  const handleSave = async () => {
    await saveSecuritySettings(settings);
  };

  const handleReset = () => {
    setSettings(defaultSecuritySettings);
  };

  const handleGenerateAPIKey = async () => {
    await generateAPIKey();
  };

  return (
    <SettingsErrorBoundary>
      <div className="space-y-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="two-factor">2FA</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="access-control">Access Control</TabsTrigger>
            <TabsTrigger value="api-security">API Security</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="authentication" className="space-y-6">
            {/* Authentication Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Authentication Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                    <Input 
                      id="max-login-attempts" 
                      type="number" 
                      value={settings.maxLoginAttempts}
                      onChange={(e) => setSettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                    <Input 
                      id="lockout-duration" 
                      type="number" 
                      value={settings.lockoutDuration}
                      onChange={(e) => setSettings(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable Account Lockout</h4>
                      <p className="text-sm text-bjj-gray">Lock accounts after failed login attempts</p>
                    </div>
                    <Switch 
                      checked={settings.enableAccountLockout}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAccountLockout: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require CAPTCHA</h4>
                      <p className="text-sm text-bjj-gray">Show CAPTCHA after failed attempts</p>
                    </div>
                    <Switch 
                      checked={settings.requireCaptcha}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireCaptcha: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="two-factor">
            <TwoFactorAuth />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionManagement />
          </TabsContent>

          <TabsContent value="access-control" className="space-y-6">
            {/* Access Control Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
                  <Input 
                    id="session-timeout" 
                    type="number" 
                    value={settings.sessionTimeoutHours}
                    onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeoutHours: parseInt(e.target.value) }))}
                    className="max-w-sm"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable IP Whitelist</h4>
                      <p className="text-sm text-bjj-gray">Only allow access from specific IPs</p>
                    </div>
                    <Switch 
                      checked={settings.enableIPWhitelist}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableIPWhitelist: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable Geo-blocking</h4>
                      <p className="text-sm text-bjj-gray">Block access from certain countries</p>
                    </div>
                    <Switch 
                      checked={settings.enableGeoBlocking}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableGeoBlocking: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-security" className="space-y-6">
            {/* API Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="api-rate-limit">API Rate Limit (requests/minute)</Label>
                    <Input 
                      id="api-rate-limit" 
                      type="number" 
                      value={settings.apiRateLimit}
                      onChange={(e) => setSettings(prev => ({ ...prev, apiRateLimit: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-key-expiry">API Key Expiry (days)</Label>
                    <Input 
                      id="api-key-expiry" 
                      type="number" 
                      value={settings.apiKeyExpiry}
                      onChange={(e) => setSettings(prev => ({ ...prev, apiKeyExpiry: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require API Key</h4>
                      <p className="text-sm text-bjj-gray">Require API key for all requests</p>
                    </div>
                    <Switch 
                      checked={settings.requireAPIKey}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireAPIKey: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable CORS Protection</h4>
                      <p className="text-sm text-bjj-gray">Enable Cross-Origin Resource Sharing protection</p>
                    </div>
                    <Switch 
                      checked={settings.enableCORSProtection}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableCORSProtection: checked }))}
                    />
                  </div>
                </div>
                <Button variant="outline" onClick={handleGenerateAPIKey} disabled={isLoading}>
                  <Key className="h-4 w-4 mr-2" />
                  {isLoading ? "Generating..." : "Generate New API Key"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Settings */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            Reset to Defaults
          </Button>
          <Button 
            className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Security Settings"}
          </Button>
        </div>
      </div>
    </SettingsErrorBoundary>
  );
};
