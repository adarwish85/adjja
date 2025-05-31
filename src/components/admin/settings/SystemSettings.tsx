
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Database, 
  Mail, 
  Bell,
  HardDrive,
  Activity,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

export const SystemSettings = () => {
  const systemStatus = [
    { name: "Database", status: "Healthy", uptime: "99.9%", lastCheck: "2 minutes ago" },
    { name: "Email Service", status: "Healthy", uptime: "99.7%", lastCheck: "5 minutes ago" },
    { name: "File Storage", status: "Warning", uptime: "98.5%", lastCheck: "1 minute ago" },
    { name: "Backup System", status: "Healthy", uptime: "100%", lastCheck: "30 minutes ago" },
  ];

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemStatus.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${
                    service.status === 'Healthy' ? 'bg-green-500' : 
                    service.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={service.status === 'Healthy' ? 'default' : 'destructive'}>
                    {service.status}
                  </Badge>
                  <span className="text-sm text-bjj-gray">Uptime: {service.uptime}</span>
                  <span className="text-sm text-bjj-gray">Last check: {service.lastCheck}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max-connections">Max Connections</Label>
              <Input id="max-connections" type="number" defaultValue="100" />
            </div>
            <div>
              <Label htmlFor="query-timeout">Query Timeout (seconds)</Label>
              <Input id="query-timeout" type="number" defaultValue="30" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Query Logging</h4>
              <p className="text-sm text-bjj-gray">Log all database queries for debugging</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto Backup</h4>
              <p className="text-sm text-bjj-gray">Automatically backup database daily</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div>
            <Label htmlFor="backup-time">Backup Time</Label>
            <Input id="backup-time" type="time" defaultValue="02:00" className="max-w-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Storage Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max-file-size">Max File Upload Size (MB)</Label>
              <Input id="max-file-size" type="number" defaultValue="50" />
            </div>
            <div>
              <Label htmlFor="storage-provider">Storage Provider</Label>
              <Select defaultValue="local">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Storage</SelectItem>
                  <SelectItem value="aws-s3">AWS S3</SelectItem>
                  <SelectItem value="google-cloud">Google Cloud</SelectItem>
                  <SelectItem value="azure">Azure Blob</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="allowed-types">Allowed File Types</Label>
            <Input 
              id="allowed-types" 
              defaultValue="jpg, jpeg, png, pdf, doc, docx, xls, xlsx" 
              placeholder="Comma-separated file extensions"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable File Compression</h4>
              <p className="text-sm text-bjj-gray">Automatically compress uploaded images</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" defaultValue="smtp.gmail.com" />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" type="number" defaultValue="587" />
            </div>
            <div>
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input id="smtp-username" defaultValue="noreply@adjja.com" />
            </div>
            <div>
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input id="smtp-password" type="password" />
            </div>
          </div>
          <div>
            <Label htmlFor="from-email">Default From Email</Label>
            <Input id="from-email" defaultValue="ADJJA Academy <noreply@adjja.com>" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable SSL/TLS</h4>
              <p className="text-sm text-bjj-gray">Use secure connection for email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Test Email Configuration
          </Button>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Performance Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cache-ttl">Cache TTL (minutes)</Label>
              <Input id="cache-ttl" type="number" defaultValue="60" />
            </div>
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input id="session-timeout" type="number" defaultValue="120" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Redis Caching</h4>
              <p className="text-sm text-bjj-gray">Use Redis for improved performance</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable CDN</h4>
              <p className="text-sm text-bjj-gray">Use content delivery network for static assets</p>
            </div>
            <Switch />
          </div>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear All Caches
          </Button>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
          Save System Settings
        </Button>
      </div>
    </div>
  );
};
