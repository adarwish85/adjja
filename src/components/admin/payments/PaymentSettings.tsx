
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  CreditCard, 
  Bell, 
  Shield,
  Mail,
  Webhook,
  Key,
  DollarSign
} from "lucide-react";
import { useAppSettings } from "@/contexts/SettingsContext";

export const PaymentSettings = () => {
  const { currency, academyName } = useAppSettings();

  // Get currency display name and symbol
  const getCurrencyInfo = (currencyCode: string) => {
    const currencyMap: Record<string, { name: string; symbol: string }> = {
      'egp': { name: 'Egyptian Pound', symbol: 'LE' },
      'usd': { name: 'US Dollar', symbol: '$' },
      'eur': { name: 'Euro', symbol: '€' },
      'gbp': { name: 'British Pound', symbol: '£' },
      'aed': { name: 'UAE Dirham', symbol: 'AED' },
      'sar': { name: 'Saudi Riyal', symbol: 'SR' },
    };
    return currencyMap[currencyCode.toLowerCase()] || { name: currencyCode.toUpperCase(), symbol: currencyCode.toUpperCase() };
  };

  const currencyInfo = getCurrencyInfo(currency);

  const gatewaySettings = [
    {
      name: "Stripe",
      status: "connected",
      testMode: true,
      webhookUrl: "https://yourapp.com/webhooks/stripe",
      apiKey: "sk_test_***************1234"
    },
    {
      name: "PayPal",
      status: "connected",
      testMode: false,
      webhookUrl: "https://yourapp.com/webhooks/paypal",
      apiKey: "sb.***************5678"
    }
  ];

  const notificationSettings = [
    { name: "Payment Success Notifications", enabled: true, type: "email" },
    { name: "Payment Failure Alerts", enabled: true, type: "email" },
    { name: "Subscription Renewal Reminders", enabled: true, type: "email" },
    { name: "Chargeback Notifications", enabled: true, type: "email" },
    { name: "Daily Revenue Reports", enabled: false, type: "email" },
    { name: "Weekly Analytics Summary", enabled: true, type: "email" }
  ];

  const securitySettings = [
    { name: "Require 3D Secure", enabled: true, description: "Additional authentication for credit card payments" },
    { name: "Fraud Detection", enabled: true, description: "Automatically block suspicious transactions" },
    { name: "IP Geolocation Check", enabled: false, description: "Verify payment location matches user location" },
    { name: "Velocity Checking", enabled: true, description: "Monitor multiple payments from same source" }
  ];

  return (
    <div className="space-y-6">
      {/* Currency Display Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Current Payment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payment Currency</Label>
              <div className="p-4 bg-muted rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold text-bjj-navy">{currencyInfo.symbol}</div>
                  <div>
                    <p className="font-semibold text-bjj-navy">{currencyInfo.name}</p>
                    <p className="text-sm text-muted-foreground">Code: {currency.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Academy Name</Label>
              <div className="p-4 bg-muted rounded-lg border">
                <p className="font-semibold text-bjj-navy">{academyName}</p>
                <p className="text-sm text-muted-foreground">Used in payment descriptions</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Currency settings are managed in the main Settings tab. 
              All payment amounts, receipts, and invoices will use {currency.toUpperCase()} as configured.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Gateway Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway Configuration
          </CardTitle>
          <p className="text-sm text-bjj-gray">Configure API keys and webhook endpoints for payment processors</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {gatewaySettings.map((gateway, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-bjj-navy">{gateway.name}</h3>
                  <Badge variant="outline" className={
                    gateway.status === 'connected' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }>
                    {gateway.status}
                  </Badge>
                  {gateway.testMode && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Test Mode
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor={`api-key-${index}`}>API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`api-key-${index}`}
                      type="password"
                      value={gateway.apiKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`webhook-${index}`}>Webhook URL</Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`webhook-${index}`}
                      value={gateway.webhookUrl}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      <Webhook className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* General Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            General Payment Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Input 
                id="currency" 
                value={`${currency.toUpperCase()} - ${currencyInfo.name}`} 
                readOnly 
                className="bg-muted"
              />
              <p className="text-xs text-bjj-gray mt-1">
                Currency is managed in the main Settings tab
              </p>
            </div>
            <div>
              <Label htmlFor="statement-descriptor">Statement Descriptor</Label>
              <Input 
                id="statement-descriptor" 
                placeholder={`${academyName.toUpperCase().slice(0, 15)}`}
                maxLength={22}
              />
              <p className="text-xs text-bjj-gray mt-1">
                This appears on customer credit card statements (max 22 characters)
              </p>
            </div>
            <div>
              <Label htmlFor="receipt-email">Receipt Email Template</Label>
              <Input 
                id="receipt-email" 
                placeholder="noreply@adjja.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <p className="text-sm text-bjj-gray">Configure email notifications for payment events</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationSettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-bjj-gray" />
                  <div>
                    <p className="font-medium text-bjj-navy">{setting.name}</p>
                    <p className="text-sm text-bjj-gray">Email notification</p>
                  </div>
                </div>
                <Switch checked={setting.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Fraud Prevention
          </CardTitle>
          <p className="text-sm text-bjj-gray">Configure security measures and fraud detection</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securitySettings.map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <Shield className="h-4 w-4 text-bjj-gray" />
                    <p className="font-medium text-bjj-navy">{setting.name}</p>
                  </div>
                  <p className="text-sm text-bjj-gray ml-7">{setting.description}</p>
                </div>
                <Switch checked={setting.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Reset to Defaults
        </Button>
        <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
          Save Settings
        </Button>
      </div>
    </div>
  );
};
