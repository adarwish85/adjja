import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings,
  Users,
  Clock,
  DollarSign,
  BarChart,
  Calendar,
  Mail,
  Save,
  RotateCcw,
  AlertCircle,
  BookOpen,
  Video
} from "lucide-react";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { useSettings } from "@/hooks/useSettings";
import { useAppSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";

export const CentralizedSettings = () => {
  const { settingsByCategory, isLoading, updateSetting } = useSystemSettings();
  const { worldTimezones, worldCurrencies } = useSettings();
  const { currency, academyName } = useAppSettings();
  const { toast } = useToast();
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState("general");

  // Helper to get current value (pending or saved)
  const getCurrentValue = (category: string, key: string, defaultValue: any) => {
    const pendingKey = `${category}.${key}`;
    if (pendingChanges[pendingKey] !== undefined) {
      return pendingChanges[pendingKey];
    }
    return settingsByCategory[category]?.[key] ?? defaultValue;
  };

  // Helper to update pending changes
  const updatePendingValue = (category: string, key: string, value: any) => {
    const pendingKey = `${category}.${key}`;
    setPendingChanges(prev => ({
      ...prev,
      [pendingKey]: value
    }));
  };

  // Save all pending changes
  const saveAllChanges = async () => {
    try {
      for (const [pendingKey, value] of Object.entries(pendingChanges)) {
        const [category, key] = pendingKey.split('.');
        await updateSetting(category, key, value);
      }
      setPendingChanges({});
      toast({
        title: "Success",
        description: "All settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

  // Reset pending changes
  const resetChanges = () => {
    setPendingChanges({});
  };

  // Get currency display name
  const getCurrencyDisplay = (currencyCode: string) => {
    const currencyMap: Record<string, string> = {
      'egp': 'EGP (Egyptian Pound)',
      'usd': 'USD (US Dollar)',
      'eur': 'EUR (Euro)',
      'gbp': 'GBP (British Pound)',
      'aed': 'AED (UAE Dirham)',
      'sar': 'SAR (Saudi Riyal)',
    };
    return currencyMap[currencyCode.toLowerCase()] || currencyCode.toUpperCase();
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading centralized settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      {hasPendingChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  You have {Object.keys(pendingChanges).length} unsaved changes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={resetChanges}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button size="sm" onClick={saveAllChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            Students
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Clock className="h-4 w-4 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="lms">
            <BookOpen className="h-4 w-4 mr-2" />
            LMS
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Mail className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">General Academy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="academy-name">Academy Name</Label>
                  <Input
                    id="academy-name"
                    value={getCurrentValue('general', 'academy_name', '')}
                    onChange={(e) => updatePendingValue('general', 'academy_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="academy-code">Academy Code</Label>
                  <Input
                    id="academy-code"
                    value={getCurrentValue('general', 'academy_code', '')}
                    onChange={(e) => updatePendingValue('general', 'academy_code', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={getCurrentValue('general', 'timezone', 'africa/cairo')}
                    onValueChange={(value) => updatePendingValue('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {worldTimezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={getCurrentValue('general', 'currency', 'egp')}
                    onValueChange={(value) => updatePendingValue('general', 'currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {worldCurrencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="attendance-buffer">Default Attendance Buffer (minutes)</Label>
                  <Input
                    id="attendance-buffer"
                    type="number"
                    value={getCurrentValue('general', 'default_attendance_buffer', 15)}
                    onChange={(e) => updatePendingValue('general', 'default_attendance_buffer', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Student Management Settings */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Student Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Student Check-in</Label>
                    <p className="text-sm text-gray-500">Allow students to check themselves into classes</p>
                  </div>
                  <Switch
                    checked={getCurrentValue('student_management', 'enable_student_checkin', true)}
                    onCheckedChange={(checked) => updatePendingValue('student_management', 'enable_student_checkin', checked)}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <Label htmlFor="default-status">Default Student Status</Label>
                  <Select
                    value={getCurrentValue('student_management', 'default_student_status', 'active')}
                    onValueChange={(value) => updatePendingValue('student_management', 'default_student_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="max-students">Max Students Per Plan (0 = unlimited)</Label>
                  <Input
                    id="max-students"
                    type="number"
                    value={getCurrentValue('student_management', 'max_students_per_plan', 0)}
                    onChange={(e) => updatePendingValue('student_management', 'max_students_per_plan', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Settings */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Attendance Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Instructor Validation</Label>
                    <p className="text-sm text-gray-500">Instructors must validate student attendance</p>
                  </div>
                  <Switch
                    checked={getCurrentValue('attendance', 'enable_instructor_validation', true)}
                    onCheckedChange={(checked) => updatePendingValue('attendance', 'enable_instructor_validation', checked)}
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="late-threshold">Late Threshold (minutes)</Label>
                  <Input
                    id="late-threshold"
                    type="number"
                    value={getCurrentValue('attendance', 'late_threshold_minutes', 10)}
                    onChange={(e) => updatePendingValue('attendance', 'late_threshold_minutes', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="auto-absence">Auto Absence (minutes after class start)</Label>
                  <Input
                    id="auto-absence"
                    type="number"
                    value={getCurrentValue('attendance', 'auto_absence_minutes', 30)}
                    onChange={(e) => updatePendingValue('attendance', 'auto_absence_minutes', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Payment & Billing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reminder-interval">Payment Reminder Interval (days)</Label>
                  <Input
                    id="reminder-interval"
                    type="number"
                    value={getCurrentValue('payment', 'payment_reminder_interval_days', 7)}
                    onChange={(e) => updatePendingValue('payment', 'payment_reminder_interval_days', parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Partial Payments</Label>
                    <p className="text-sm text-gray-500">Students can make partial payments</p>
                  </div>
                  <Switch
                    checked={getCurrentValue('payment', 'allow_partial_payment', false)}
                    onCheckedChange={(checked) => updatePendingValue('payment', 'allow_partial_payment', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="late-fee">Late Payment Fee (%)</Label>
                  <Input
                    id="late-fee"
                    type="number"
                    value={getCurrentValue('payment', 'late_payment_fee_percentage', 5)}
                    onChange={(e) => updatePendingValue('payment', 'late_payment_fee_percentage', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LMS Settings */}
        <TabsContent value="lms">
          <div className="space-y-6">
            {/* Currency Display Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Current Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Academy Currency</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <span className="font-medium text-bjj-navy">{getCurrencyDisplay(currency)}</span>
                      <p className="text-sm text-muted-foreground">
                        All course prices will be displayed in {currency.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Academy Name</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <span className="font-medium text-bjj-navy">{academyName}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Currency and academy settings are managed in the General tab. Changes there will automatically reflect across all modules.
                </p>
              </CardContent>
            </Card>

            {/* General LMS Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  General LMS Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={getCurrentValue('lms', 'platform_name', 'ADJJA LMS')}
                      onChange={(e) => updatePendingValue('lms', 'platform_name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={getCurrentValue('lms', 'contact_email', 'admin@adjja.com')}
                      onChange={(e) => updatePendingValue('lms', 'contact_email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platformDescription">Platform Description</Label>
                  <Textarea
                    id="platformDescription"
                    value={getCurrentValue('lms', 'platform_description', 'Brazilian Jiu-Jitsu Learning Management System')}
                    onChange={(e) => updatePendingValue('lms', 'platform_description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow New Registrations</Label>
                      <p className="text-sm text-bjj-gray">Allow new students to register for courses</p>
                    </div>
                    <Switch
                      checked={getCurrentValue('lms', 'allow_registration', true)}
                      onCheckedChange={(checked) => updatePendingValue('lms', 'allow_registration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Approval</Label>
                      <p className="text-sm text-bjj-gray">Require admin approval for new enrollments</p>
                    </div>
                    <Switch
                      checked={getCurrentValue('lms', 'require_approval', false)}
                      onCheckedChange={(checked) => updatePendingValue('lms', 'require_approval', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultAccess">Default Course Access</Label>
                  <Select
                    value={getCurrentValue('lms', 'default_course_access', 'immediate')}
                    onValueChange={(value) => updatePendingValue('lms', 'default_course_access', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="approval">Requires Approval</SelectItem>
                      <SelectItem value="payment">After Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Course Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Course Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxCourseSize">Max Course Size (MB)</Label>
                    <Input
                      id="maxCourseSize"
                      type="number"
                      value={getCurrentValue('lms', 'max_course_size', 100)}
                      onChange={(e) => updatePendingValue('lms', 'max_course_size', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoQuality">Default Video Quality</Label>
                    <Select
                      value={getCurrentValue('lms', 'video_quality', '720p')}
                      onValueChange={(value) => updatePendingValue('lms', 'video_quality', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480p">480p</SelectItem>
                        <SelectItem value="720p">720p</SelectItem>
                        <SelectItem value="1080p">1080p</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passGrade">Passing Grade (%)</Label>
                    <Input
                      id="passGrade"
                      type="number"
                      min="0"
                      max="100"
                      value={getCurrentValue('lms', 'pass_grade', 80)}
                      onChange={(e) => updatePendingValue('lms', 'pass_grade', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Content Downloads</Label>
                      <p className="text-sm text-bjj-gray">Allow students to download course materials</p>
                    </div>
                    <Switch
                      checked={getCurrentValue('lms', 'allow_downloads', false)}
                      onCheckedChange={(checked) => updatePendingValue('lms', 'allow_downloads', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Certificates</Label>
                      <p className="text-sm text-bjj-gray">Generate certificates upon course completion</p>
                    </div>
                    <Switch
                      checked={getCurrentValue('lms', 'certificate_enabled', true)}
                      onCheckedChange={(checked) => updatePendingValue('lms', 'certificate_enabled', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LMS Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-bjj-navy flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  LMS Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enrollment Notifications</Label>
                      <p className="text-sm text-bjj-gray">Notify when students enroll in courses</p>
                    </div>
                    <Switch
                      checked={getCurrentValue('lms', 'enrollment_notifications', true)}
                      onCheckedChange={(checked) => updatePendingValue('lms', 'enrollment_notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Progress Notifications</Label>
                      <p className="text-sm text-bjj-gray">Notify about student progress milestones</p>
                    </div>
                    <Switch
                      checked={getCurrentValue('lms', 'progress_notifications', true)}
                      onCheckedChange={(checked) => updatePendingValue('lms', 'progress_notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Completion Notifications</Label>
                      <p className="text-sm text-bjj-gray">Notify when students complete courses</p>
                    </div>
                    <Switch
                      checked={getCurrentValue('lms', 'completion_notifications', true)}
                      onCheckedChange={(checked) => updatePendingValue('lms', 'completion_notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reminder Notifications</Label>
                      <p className="text-sm text-bjj-gray">Send reminder notifications to students</p>
                    </div>
                    <Switch
                      checked={getCurrentValue('lms', 'reminder_notifications', true)}
                      onCheckedChange={(checked) => updatePendingValue('lms', 'reminder_notifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Settings */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Analytics & Reporting Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Revenue Tracking</Label>
                    <p className="text-sm text-gray-500">Track revenue analytics and reports</p>
                  </div>
                  <Switch
                    checked={getCurrentValue('analytics', 'enable_revenue_tracking', true)}
                    onCheckedChange={(checked) => updatePendingValue('analytics', 'enable_revenue_tracking', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Attendance Heatmap</Label>
                    <p className="text-sm text-gray-500">Show attendance patterns in heatmap format</p>
                  </div>
                  <Switch
                    checked={getCurrentValue('analytics', 'enable_attendance_heatmap', true)}
                    onCheckedChange={(checked) => updatePendingValue('analytics', 'enable_attendance_heatmap', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="cache-interval">Cache Refresh Interval (hours)</Label>
                  <Input
                    id="cache-interval"
                    type="number"
                    value={getCurrentValue('analytics', 'cache_refresh_interval_hours', 24)}
                    onChange={(e) => updatePendingValue('analytics', 'cache_refresh_interval_hours', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-bjj-navy">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send email notifications to users</p>
                  </div>
                  <Switch
                    checked={getCurrentValue('notifications', 'enable_email_notifications', true)}
                    onCheckedChange={(checked) => updatePendingValue('notifications', 'enable_email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Send SMS notifications to users</p>
                  </div>
                  <Switch
                    checked={getCurrentValue('notifications', 'enable_sms_notifications', false)}
                    onCheckedChange={(checked) => updatePendingValue('notifications', 'enable_sms_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Plan Expiry Notifications</Label>
                    <p className="text-sm text-gray-500">Notify students before their plan expires</p>
                  </div>
                  <Switch
                    checked={getCurrentValue('notifications', 'plan_expiry_notification', true)}
                    onCheckedChange={(checked) => updatePendingValue('notifications', 'plan_expiry_notification', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
