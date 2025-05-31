
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  CreditCard, 
  Mail, 
  Shield, 
  Database,
  Palette,
  Globe,
  Users
} from "lucide-react";

export const LMSSettings = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input id="platform-name" defaultValue="ADJJA LMS" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform-url">Platform URL</Label>
                    <Input id="platform-url" defaultValue="lms.adjja.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="platform-description">Platform Description</Label>
                  <Textarea 
                    id="platform-description" 
                    defaultValue="Professional Brazilian Jiu-Jitsu training platform for students of all levels."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Course Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-enroll new students</Label>
                        <p className="text-sm text-bjj-gray">Automatically enroll new students in free courses</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow course previews</Label>
                        <p className="text-sm text-bjj-gray">Let users preview course content before purchasing</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Enable course comments</Label>
                        <p className="text-sm text-bjj-gray">Allow students to comment on course content</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Input id="currency" defaultValue="USD" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input id="tax-rate" defaultValue="10" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Payment Providers</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-bjj-navy">Stripe</p>
                          <p className="text-sm text-bjj-gray">Credit cards, bank transfers</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-yellow-100 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-bjj-navy">PayPal</p>
                          <p className="text-sm text-bjj-gray">PayPal payments</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Subscription Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trial-period">Free Trial Period (days)</Label>
                      <Input id="trial-period" defaultValue="7" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grace-period">Grace Period (days)</Label>
                      <Input id="grace-period" defaultValue="3" />
                    </div>
                  </div>
                </div>

                <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Email Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Welcome emails</Label>
                        <p className="text-sm text-bjj-gray">Send welcome email to new students</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Course completion</Label>
                        <p className="text-sm text-bjj-gray">Notify students when they complete a course</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Payment confirmations</Label>
                        <p className="text-sm text-bjj-gray">Send receipts and payment confirmations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Course updates</Label>
                        <p className="text-sm text-bjj-gray">Notify students about new content in enrolled courses</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Admin Notifications</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New enrollments</Label>
                        <p className="text-sm text-bjj-gray">Get notified when students enroll in courses</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Payment failures</Label>
                        <p className="text-sm text-bjj-gray">Alert when payments fail</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Course reviews</Label>
                        <p className="text-sm text-bjj-gray">Notify when students leave reviews</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Authentication</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require email verification</Label>
                        <p className="text-sm text-bjj-gray">Users must verify email before accessing content</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-factor authentication</Label>
                        <p className="text-sm text-bjj-gray">Enable 2FA for admin accounts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Single sign-on (SSO)</Label>
                        <p className="text-sm text-bjj-gray">Allow login with Google/Facebook</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Content Protection</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Video watermarking</Label>
                        <p className="text-sm text-bjj-gray">Add watermarks to video content</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Download restrictions</Label>
                        <p className="text-sm text-bjj-gray">Prevent unauthorized downloads</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>IP restrictions</Label>
                        <p className="text-sm text-bjj-gray">Limit access by IP address</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Available Integrations</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-bjj-navy">Mailchimp</p>
                          <p className="text-sm text-bjj-gray">Email marketing automation</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-green-100 rounded flex items-center justify-center">
                          <Users className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-bjj-navy">Slack</p>
                          <p className="text-sm text-bjj-gray">Team notifications</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-purple-100 rounded flex items-center justify-center">
                          <Database className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-bjj-navy">Zapier</p>
                          <p className="text-sm text-bjj-gray">Workflow automation</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                  Save Integration Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Branding & Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Colors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-bjj-gold rounded border" />
                        <Input id="primary-color" defaultValue="#D4AF37" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-bjj-navy rounded border" />
                        <Input id="secondary-color" defaultValue="#1E3A8A" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accent-color">Accent Color</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-600 rounded border" />
                        <Input id="accent-color" defaultValue="#6B7280" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-bjj-navy">Logo & Images</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Platform Logo</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Globe className="h-8 w-8 text-bjj-gray mx-auto mb-2" />
                        <p className="text-sm text-bjj-gray">Upload logo (recommended: 200x60px)</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Choose File
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Favicon</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Globe className="h-8 w-8 text-bjj-gray mx-auto mb-2" />
                        <p className="text-sm text-bjj-gray">Upload favicon (32x32px)</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <Textarea 
                    id="custom-css" 
                    placeholder="/* Add your custom CSS here */"
                    rows={6}
                  />
                </div>

                <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
                  Save Branding Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
