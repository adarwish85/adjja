
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle,
  Key,
  UserCheck,
  Globe,
  Monitor,
  Clock
} from "lucide-react";
import { useSettings, SecuritySettings as SecuritySettingsType } from "@/hooks/useSettings";
import { SecurityDashboard } from "./security/SecurityDashboard";
import { TwoFactorAuth } from "./security/TwoFactorAuth";
import { SessionManagement } from "./security/SessionManagement";
import { UserPermissions } from "./users/UserPermissions";

export const SecuritySettings = () => {
  const { defaultSecuritySettings, saveSecuritySettings, generateAPIKey, isLoading } = useSettings();
  const [settings, setSettings] = useState<SecuritySettingsType>(defaultSecuritySettings);

  const securityLogs = [
    { timestamp: "2024-01-15 10:30", event: "Failed login attempt", user: "unknown@email.com", severity: "medium" },
    { timestamp: "2024-01-15 09:15", event: "Password changed", user: "john@adjja.com", severity: "low" },
    { timestamp: "2024-01-15 08:45", event: "Admin access granted", user: "sarah@adjja.com", severity: "high" },
    { timestamp: "2024-01-15 07:30", event: "Multiple login attempts", user: "192.168.1.100", severity: "high" },
  ];

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
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="authentication" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Auth
          </TabsTrigger>
          <TabsTrigger value="2fa" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            2FA
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <SecurityDashboard />
        </TabsContent>

        <TabsContent value="authentication">
          <div className="space-y-6">
            {/* Login Security */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Login Security
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
              </CardContent>
            </Card>

            {/* IP Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  IP Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable IP Whitelist</h4>
                    <p className="text-sm text-bjj-gray">Only allow access from specific IP addresses</p>
                  </div>
                  <Switch 
                    checked={settings.enableIPWhitelist}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableIPWhitelist: checked }))}
                  />
                </div>
                <div>
                  <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                  <Input 
                    id="allowed-ips" 
                    placeholder="192.168.1.0/24, 10.0.0.1"
                    className="font-mono text-sm"
                    value={settings.allowedIPs}
                    onChange={(e) => setSettings(prev => ({ ...prev, allowedIPs: e.target.value }))}
                  />
                  <p className="text-xs text-bjj-gray mt-1">Comma-separated IP addresses or CIDR blocks</p>
                </div>
                <div>
                  <Label htmlFor="blocked-ips">Blocked IP Addresses</Label>
                  <Input 
                    id="blocked-ips" 
                    placeholder="192.168.100.50, 10.0.0.100"
                    className="font-mono text-sm"
                    value={settings.blockedIPs}
                    onChange={(e) => setSettings(prev => ({ ...prev, blockedIPs: e.target.value }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Geo-blocking</h4>
                    <p className="text-sm text-bjj-gray">Block access from specific countries</p>
                  </div>
                  <Switch 
                    checked={settings.enableGeoBlocking}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableGeoBlocking: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="2fa">
          <TwoFactorAuth />
        </TabsContent>

        <TabsContent value="sessions">
          <SessionManagement />
        </TabsContent>

        <TabsContent value="permissions">
          <UserPermissions />
        </TabsContent>

        <TabsContent value="advanced">
          <div className="space-y-6">
            {/* API Security */}
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
                    <Label htmlFor="api-rate-limit">Rate Limit (requests/minute)</Label>
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
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Require API Key Authentication</h4>
                    <p className="text-sm text-bjj-gray">All API requests must include valid API key</p>
                  </div>
                  <Switch 
                    checked={settings.requireAPIKey}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, requireAPIKey: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable CORS Protection</h4>
                    <p className="text-sm text-bjj-gray">Restrict cross-origin requests</p>
                  </div>
                  <Switch 
                    checked={settings.enableCORSProtection}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableCORSProtection: checked }))}
                  />
                </div>
                <Button variant="outline" onClick={handleGenerateAPIKey} disabled={isLoading}>
                  <Key className="h-4 w-4 mr-2" />
                  {isLoading ? "Generating..." : "Generate New API Key"}
                </Button>
              </CardContent>
            </Card>

            {/* Security Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Security Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Security Logging</h4>
                    <p className="text-sm text-bjj-gray">Log all security-related events</p>
                  </div>
                  <Switch 
                    checked={settings.enableSecurityLogging}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSecurityLogging: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Real-time Alerts</h4>
                    <p className="text-sm text-bjj-gray">Send immediate alerts for security threats</p>
                  </div>
                  <Switch 
                    checked={settings.realTimeAlerts}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, realTimeAlerts: checked }))}
                  />
                </div>
                <div>
                  <Label htmlFor="alert-email">Security Alert Email</Label>
                  <Input 
                    id="alert-email" 
                    type="email" 
                    value={settings.securityAlertEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, securityAlertEmail: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Security Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityLogs.map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${
                          log.severity === 'high' ? 'bg-red-500' : 
                          log.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <p className="font-medium text-bjj-navy">{log.event}</p>
                          <p className="text-sm text-bjj-gray">{log.user}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          log.severity === 'high' ? 'destructive' : 
                          log.severity === 'medium' ? 'secondary' : 'default'
                        }>
                          {log.severity}
                        </Badge>
                        <span className="text-sm text-bjj-gray">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Security Logs
                </Button>
              </CardContent>
            </Card>
          </div>
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
  );
};
