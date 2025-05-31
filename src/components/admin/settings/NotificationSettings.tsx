
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
  Smartphone,
  Clock,
  Users,
  DollarSign,
  Calendar
} from "lucide-react";

export const NotificationSettings = () => {
  const notificationTypes = [
    {
      category: "User Management",
      icon: Users,
      settings: [
        { name: "New Student Registration", email: true, sms: false, push: true },
        { name: "Coach Assignment", email: true, sms: false, push: false },
        { name: "User Account Deactivation", email: true, sms: false, push: false },
        { name: "Password Reset Requests", email: true, sms: true, push: false }
      ]
    },
    {
      category: "Classes & Scheduling",
      icon: Calendar,
      settings: [
        { name: "Class Cancellation", email: true, sms: true, push: true },
        { name: "Schedule Changes", email: true, sms: false, push: true },
        { name: "Low Attendance Alert", email: true, sms: false, push: false },
        { name: "Class Capacity Reached", email: false, sms: false, push: true }
      ]
    },
    {
      category: "Payments & Billing",
      icon: DollarSign,
      settings: [
        { name: "Payment Success", email: true, sms: false, push: false },
        { name: "Payment Failed", email: true, sms: true, push: true },
        { name: "Subscription Expiring", email: true, sms: true, push: true },
        { name: "Refund Processed", email: true, sms: false, push: false }
      ]
    },
    {
      category: "System Alerts",
      icon: Bell,
      settings: [
        { name: "System Maintenance", email: true, sms: false, push: true },
        { name: "Security Alerts", email: true, sms: true, push: true },
        { name: "Backup Completed", email: false, sms: false, push: false },
        { name: "API Rate Limit Exceeded", email: true, sms: false, push: false }
      ]
    }
  ];

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
            <Switch defaultChecked />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="notification-from">Notification From Name</Label>
              <Input id="notification-from" defaultValue="ADJJA Academy" />
            </div>
            <div>
              <Label htmlFor="notification-email">Notification From Email</Label>
              <Input id="notification-email" defaultValue="notifications@adjja.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="quiet-hours-start">Quiet Hours</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input id="quiet-hours-start" type="time" defaultValue="22:00" className="w-32" />
              <span>to</span>
              <Input id="quiet-hours-end" type="time" defaultValue="08:00" className="w-32" />
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
              <Input id="smtp-username" defaultValue="notifications@adjja.com" />
            </div>
            <div>
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input id="smtp-password" type="password" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable HTML Emails</h4>
              <p className="text-sm text-bjj-gray">Send rich HTML formatted emails</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Test Email
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
              <Select defaultValue="twilio">
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
              <Input id="sms-from" defaultValue="+61400123456" />
            </div>
          </div>
          <div>
            <Label htmlFor="twilio-api-key">Twilio API Key</Label>
            <Input id="twilio-api-key" type="password" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable SMS Notifications</h4>
              <p className="text-sm text-bjj-gray">Send SMS notifications to users</p>
            </div>
            <Switch />
          </div>
          <Button variant="outline">
            <Smartphone className="h-4 w-4 mr-2" />
            Send Test SMS
          </Button>
        </CardContent>
      </Card>

      {/* Notification Types */}
      {notificationTypes.map((category) => (
        <Card key={category.category}>
          <CardHeader>
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <category.icon className="h-5 w-5" />
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-bjj-gray border-b pb-2">
                <div>Notification Type</div>
                <div className="text-center">Email</div>
                <div className="text-center">SMS</div>
                <div className="text-center">Push</div>
              </div>
              {category.settings.map((setting, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center py-2">
                  <div className="font-medium text-bjj-navy">{setting.name}</div>
                  <div className="flex justify-center">
                    <Switch defaultChecked={setting.email} />
                  </div>
                  <div className="flex justify-center">
                    <Switch defaultChecked={setting.sms} />
                  </div>
                  <div className="flex justify-center">
                    <Switch defaultChecked={setting.push} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Push Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Push Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="firebase-key">Firebase Server Key</Label>
            <Input id="firebase-key" type="password" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Push Notifications</h4>
              <p className="text-sm text-bjj-gray">Send push notifications to mobile apps</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Test Push Notification
          </Button>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
          Save Notification Settings
        </Button>
      </div>
    </div>
  );
};
