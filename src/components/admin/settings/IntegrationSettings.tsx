import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plug, 
  CreditCard, 
  Calendar, 
  Mail,
  MessageSquare,
  BarChart,
  Webhook,
  Key,
  ExternalLink,
  TestTube
} from "lucide-react";
import { useSettings, IntegrationSettings as IntegrationSettingsType } from "@/hooks/useSettings";

export const IntegrationSettings = () => {
  const { defaultIntegrationSettings, saveIntegrationSettings, isLoading } = useSettings();
  const [settings, setSettings] = useState<IntegrationSettingsType>(defaultIntegrationSettings);

  const integrations = [
    {
      name: "PayPal",
      category: "Payment",
      status: settings.paypalClientId ? "connected" : "disconnected",
      description: "PayPal payment processing",
      icon: CreditCard,
      lastSync: settings.paypalClientId ? "Active" : "Not configured"
    },
    {
      name: "Stripe",
      category: "Payment",
      status: "connected",
      description: "Payment processing and subscriptions",
      icon: CreditCard,
      lastSync: "2 hours ago"
    },
    {
      name: "Zoom",
      category: "Video Conferencing", 
      status: "connected",
      description: "Online classes and meetings",
      icon: Calendar,
      lastSync: "1 day ago"
    },
    {
      name: "Mailchimp",
      category: "Email Marketing",
      status: "disconnected",
      description: "Email campaigns and newsletters",
      icon: Mail,
      lastSync: "Never"
    },
    {
      name: "Slack",
      category: "Communication",
      status: "connected",
      description: "Team communication and notifications",
      icon: MessageSquare,
      lastSync: "5 minutes ago"
    },
    {
      name: "Google Analytics",
      category: "Analytics",
      status: "connected",
      description: "Website traffic and user behavior",
      icon: BarChart,
      lastSync: "30 minutes ago"
    }
  ];

  const webhooks = [
    { name: "Student Registration", url: "https://api.adjja.com/webhooks/student-registration", status: "active" },
    { name: "Payment Completed", url: "https://api.adjja.com/webhooks/payment-completed", status: "active" },
    { name: "Class Scheduled", url: "https://api.adjja.com/webhooks/class-scheduled", status: "inactive" }
  ];

  const handleSave = async () => {
    await saveIntegrationSettings(settings);
  };

  const handleReset = () => {
    setSettings(defaultIntegrationSettings);
  };

  const testPayPalConnection = async () => {
    // Test PayPal connection logic here
    console.log("Testing PayPal connection...");
  };

  return (
    <div className="space-y-6">
      {/* Third-Party Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Third-Party Integrations
          </CardTitle>
          <p className="text-sm text-bjj-gray">Connect with external services to enhance functionality</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-bjj-gold/20 rounded-lg flex items-center justify-center">
                    <integration.icon className="h-5 w-5 text-bjj-navy" />
                  </div>
                  <div>
                    <h4 className="font-medium text-bjj-navy">{integration.name}</h4>
                    <p className="text-sm text-bjj-gray">{integration.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {integration.category}
                      </Badge>
                      <span className="text-xs text-bjj-gray">Status: {integration.lastSync}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                    {integration.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={integration.status === 'connected' ? '' : 'bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy'}
                  >
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PayPal Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            PayPal Configuration
          </CardTitle>
          <p className="text-sm text-bjj-gray">Configure PayPal API credentials for payment processing</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
            <Input 
              id="paypal-client-id" 
              placeholder="Your PayPal Client ID"
              value={settings.paypalClientId}
              onChange={(e) => setSettings(prev => ({ ...prev, paypalClientId: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="paypal-client-secret">PayPal Client Secret</Label>
            <Input 
              id="paypal-client-secret" 
              type="password"
              placeholder="Your PayPal Client Secret"
              value={settings.paypalClientSecret}
              onChange={(e) => setSettings(prev => ({ ...prev, paypalClientSecret: e.target.value }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Sandbox Mode</h4>
              <p className="text-sm text-bjj-gray">Use PayPal sandbox environment for testing</p>
            </div>
            <Switch 
              checked={settings.paypalSandboxMode}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, paypalSandboxMode: checked }))}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={testPayPalConnection}>
              <TestTube className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
            <Button variant="outline" asChild>
              <a href="https://developer.paypal.com/developer/applications/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                PayPal Developer Console
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-base-url">API Base URL</Label>
            <Input 
              id="api-base-url" 
              value={settings.apiBaseURL}
              onChange={(e) => setSettings(prev => ({ ...prev, apiBaseURL: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="api-version">API Version</Label>
            <Input 
              id="api-version" 
              value={settings.apiVersion}
              onChange={(e) => setSettings(prev => ({ ...prev, apiVersion: e.target.value }))}
              className="max-w-sm" 
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable API Documentation</h4>
              <p className="text-sm text-bjj-gray">Make API documentation publicly accessible</p>
            </div>
            <Switch 
              checked={settings.enableAPIDocumentation}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAPIDocumentation: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable CORS</h4>
              <p className="text-sm text-bjj-gray">Allow cross-origin requests</p>
            </div>
            <Switch 
              checked={settings.enableCORS}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableCORS: checked }))}
            />
          </div>
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            View API Documentation
          </Button>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhooks
            </CardTitle>
            <Button variant="outline" size="sm">
              <Webhook className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>
          <p className="text-sm text-bjj-gray">Configure webhooks to receive real-time notifications</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {webhooks.map((webhook, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-bjj-navy">{webhook.name}</h4>
                  <p className="text-sm text-bjj-gray font-mono">{webhook.url}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                    {webhook.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Service Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Service Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mailchimp-api-key">Mailchimp API Key</Label>
              <Input 
                id="mailchimp-api-key" 
                type="password" 
                placeholder="Enter API key..."
                value={settings.mailchimpAPIKey}
                onChange={(e) => setSettings(prev => ({ ...prev, mailchimpAPIKey: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="mailchimp-list-id">Default List ID</Label>
              <Input 
                id="mailchimp-list-id" 
                placeholder="List ID..."
                value={settings.mailchimpListId}
                onChange={(e) => setSettings(prev => ({ ...prev, mailchimpListId: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Auto-subscribe New Students</h4>
              <p className="text-sm text-bjj-gray">Automatically add new students to mailing list</p>
            </div>
            <Switch 
              checked={settings.autoSubscribeNewStudents}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSubscribeNewStudents: checked }))}
            />
          </div>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
        </CardContent>
      </Card>

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
          {isLoading ? "Saving..." : "Save Integration Settings"}
        </Button>
      </div>
    </div>
  );
};
