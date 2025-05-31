
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle,
  Key,
  UserCheck,
  Globe,
  Clock
} from "lucide-react";

export const SecuritySettings = () => {
  const securityLogs = [
    { timestamp: "2024-01-15 10:30", event: "Failed login attempt", user: "unknown@email.com", severity: "medium" },
    { timestamp: "2024-01-15 09:15", event: "Password changed", user: "john@adjja.com", severity: "low" },
    { timestamp: "2024-01-15 08:45", event: "Admin access granted", user: "sarah@adjja.com", severity: "high" },
    { timestamp: "2024-01-15 07:30", event: "Multiple login attempts", user: "192.168.1.100", severity: "high" },
  ];

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Require 2FA for Admin Users</h4>
              <p className="text-sm text-bjj-gray">Force all admin users to enable 2FA</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Require 2FA for Coaches</h4>
              <p className="text-sm text-bjj-gray">Force all coaches to enable 2FA</p>
            </div>
            <Switch />
          </div>
          <div>
            <Label htmlFor="2fa-grace-period">2FA Grace Period (days)</Label>
            <Input id="2fa-grace-period" type="number" defaultValue="7" className="max-w-sm" />
            <p className="text-xs text-bjj-gray mt-1">Time users have to enable 2FA before being locked out</p>
          </div>
        </CardContent>
      </Card>

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
              <Input id="max-login-attempts" type="number" defaultValue="5" />
            </div>
            <div>
              <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
              <Input id="lockout-duration" type="number" defaultValue="30" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Account Lockout</h4>
              <p className="text-sm text-bjj-gray">Lock accounts after failed login attempts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Require CAPTCHA</h4>
              <p className="text-sm text-bjj-gray">Show CAPTCHA after failed attempts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div>
            <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
            <Input id="session-timeout" type="number" defaultValue="8" className="max-w-sm" />
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
            <Switch />
          </div>
          <div>
            <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
            <Input 
              id="allowed-ips" 
              placeholder="192.168.1.0/24, 10.0.0.1"
              className="font-mono text-sm"
            />
            <p className="text-xs text-bjj-gray mt-1">Comma-separated IP addresses or CIDR blocks</p>
          </div>
          <div>
            <Label htmlFor="blocked-ips">Blocked IP Addresses</Label>
            <Input 
              id="blocked-ips" 
              placeholder="192.168.100.50, 10.0.0.100"
              className="font-mono text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Geo-blocking</h4>
              <p className="text-sm text-bjj-gray">Block access from specific countries</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

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
              <Input id="api-rate-limit" type="number" defaultValue="100" />
            </div>
            <div>
              <Label htmlFor="api-key-expiry">API Key Expiry (days)</Label>
              <Input id="api-key-expiry" type="number" defaultValue="365" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Require API Key Authentication</h4>
              <p className="text-sm text-bjj-gray">All API requests must include valid API key</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable CORS Protection</h4>
              <p className="text-sm text-bjj-gray">Restrict cross-origin requests</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button variant="outline">
            <Key className="h-4 w-4 mr-2" />
            Generate New API Key
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
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Real-time Alerts</h4>
              <p className="text-sm text-bjj-gray">Send immediate alerts for security threats</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div>
            <Label htmlFor="alert-email">Security Alert Email</Label>
            <Input id="alert-email" type="email" defaultValue="security@adjja.com" />
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

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
          Save Security Settings
        </Button>
      </div>
    </div>
  );
};
