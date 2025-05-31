
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone
} from "lucide-react";
import { useSettings, NotificationSettings as NotificationSettingsType } from "@/hooks/useSettings";

export const NotificationSettings = () => {
  const { 
    defaultNotificationSettings, 
    saveNotificationSettings, 
    testEmailConfiguration, 
    testSMSConfiguration, 
    isLoading 
  } = useSettings();
  const [settings, setSettings] = useState<NotificationSettingsType>(defaultNotificationSettings);

  const handleSave = async () => {
    await saveNotificationSettings(settings);
  };

  const handleReset = () => {
    setSettings(defaultNotificationSettings);
  };

  const handleTestEmail = async () => {
    await testEmailConfiguration();
  };

  const handleTestSMS = async () => {
    await testSMSConfiguration();
  };

  const updateNotificationType = (type: string, channel: 'email' | 'sms' | 'push', value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: {
          ...prev.notificationTypes[type],
          [channel]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Global Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Global Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable All Notifications</h4>
              <p className="text-sm text-bjj-gray">Master switch for all notification types</p>
            </div>
            <Switch 
              checked={settings.enableAllNotifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAllNotifications: checked }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notification-from">Notification From Name</Label>
              <Input 
                id="notification-from" 
                value={settings.notificationFromName}
                onChange={(e) => setSettings(prev => ({ ...prev, notificationFromName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="notification-email">Notification From Email</Label>
              <Input 
                id="notification-email" 
                value={settings.notificationFromEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, notificationFromEmail: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="quiet-hours-start">Quiet Hours</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input 
                id="quiet-hours-start" 
                type="time" 
                value={settings.quietHoursStart}
                onChange={(e) => setSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                className="w-32" 
              />
              <span>to</span>
              <Input 
                id="quiet-hours-end" 
                type="time" 
                value={settings.quietHoursEnd}
                onChange={(e) => setSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                className="w-32" 
              />
            </div>
            <p className="text-xs text-bjj-gray mt-1">No notifications will be sent during these hours</p>
          </div>
        </CardContent>
      </Card>

      {/* Email Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable HTML Emails</h4>
              <p className="text-sm text-bjj-gray">Send rich HTML formatted emails</p>
            </div>
            <Switch 
              checked={settings.enableHTMLEmails}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableHTMLEmails: checked }))}
            />
          </div>
          <Button variant="outline" onClick={handleTestEmail} disabled={isLoading}>
            <Mail className="h-4 w-4 mr-2" />
            {isLoading ? "Testing..." : "Send Test Email"}
          </Button>
        </CardContent>
      </Card>

      {/* SMS Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sms-provider">SMS Provider</Label>
              <Select 
                value={settings.smsProvider} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, smsProvider: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="aws-sns">AWS SNS</SelectItem>
                  <SelectItem value="clicksend">ClickSend</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sms-from">SMS From Number</Label>
              <Input 
                id="sms-from" 
                value={settings.smsFromNumber}
                onChange={(e) => setSettings(prev => ({ ...prev, smsFromNumber: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable SMS Notifications</h4>
              <p className="text-sm text-bjj-gray">Send SMS notifications to users</p>
            </div>
            <Switch 
              checked={settings.enableSMSNotifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSMSNotifications: checked }))}
            />
          </div>
          <Button variant="outline" onClick={handleTestSMS} disabled={isLoading}>
            <Smartphone className="h-4 w-4 mr-2" />
            {isLoading ? "Testing..." : "Send Test SMS"}
          </Button>
        </CardContent>
      </Card>

      {/* Push Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Push Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Push Notifications</h4>
              <p className="text-sm text-bjj-gray">Send push notifications to mobile apps</p>
            </div>
            <Switch 
              checked={settings.enablePushNotifications}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enablePushNotifications: checked }))}
            />
          </div>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Test Push Notification
          </Button>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Notification Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-bjj-gray border-b pb-2">
              <div>Notification Type</div>
              <div className="text-center">Email</div>
              <div className="text-center">SMS</div>
              <div className="text-center">Push</div>
            </div>
            {Object.entries(settings.notificationTypes).map(([type, channels]) => (
              <div key={type} className="grid grid-cols-4 gap-4 items-center py-2">
                <div className="font-medium text-bjj-navy">
                  {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="flex justify-center">
                  <Switch 
                    checked={channels.email}
                    onCheckedChange={(checked) => updateNotificationType(type, 'email', checked)}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch 
                    checked={channels.sms}
                    onCheckedChange={(checked) => updateNotificationType(type, 'sms', checked)}
                  />
                </div>
                <div className="flex justify-center">
                  <Switch 
                    checked={channels.push}
                    onCheckedChange={(checked) => updateNotificationType(type, 'push', checked)}
                  />
                </div>
              </div>
            ))}
          </div>
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
          {isLoading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </div>
  );
};
