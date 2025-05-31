
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Settings, Mail, Video, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LMSSettings = () => {
  const { toast } = useToast();
  
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "ADJJA LMS",
    platformDescription: "Brazilian Jiu-Jitsu Learning Management System",
    contactEmail: "admin@adjja.com",
    allowRegistration: true,
    requireApproval: false,
    defaultCourseAccess: "immediate",
  });

  const [courseSettings, setCourseSettings] = useState({
    maxCourseSize: "100",
    videoQuality: "720p",
    allowDownloads: false,
    certificateEnabled: true,
    passGrade: "80",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enrollmentNotifications: true,
    progressNotifications: true,
    completionNotifications: true,
    reminderNotifications: true,
    emailNotifications: true,
  });

  const handleSaveGeneral = () => {
    // Save general settings logic here
    toast({
      title: "Success",
      description: "General settings saved successfully",
    });
  };

  const handleSaveCourse = () => {
    // Save course settings logic here
    toast({
      title: "Success",
      description: "Course settings saved successfully",
    });
  };

  const handleSaveNotifications = () => {
    // Save notification settings logic here
    toast({
      title: "Success",
      description: "Notification settings saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={generalSettings.platformName}
                onChange={(e) => setGeneralSettings(prev => ({
                  ...prev,
                  platformName: e.target.value
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={generalSettings.contactEmail}
                onChange={(e) => setGeneralSettings(prev => ({
                  ...prev,
                  contactEmail: e.target.value
                }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platformDescription">Platform Description</Label>
            <Textarea
              id="platformDescription"
              value={generalSettings.platformDescription}
              onChange={(e) => setGeneralSettings(prev => ({
                ...prev,
                platformDescription: e.target.value
              }))}
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
                checked={generalSettings.allowRegistration}
                onCheckedChange={(checked) => setGeneralSettings(prev => ({
                  ...prev,
                  allowRegistration: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Approval</Label>
                <p className="text-sm text-bjj-gray">Require admin approval for new enrollments</p>
              </div>
              <Switch
                checked={generalSettings.requireApproval}
                onCheckedChange={(checked) => setGeneralSettings(prev => ({
                  ...prev,
                  requireApproval: checked
                }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultAccess">Default Course Access</Label>
            <Select
              value={generalSettings.defaultCourseAccess}
              onValueChange={(value) => setGeneralSettings(prev => ({
                ...prev,
                defaultCourseAccess: value
              }))}
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

          <Button onClick={handleSaveGeneral} className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
            <Save className="h-4 w-4 mr-2" />
            Save General Settings
          </Button>
        </CardContent>
      </Card>

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
                value={courseSettings.maxCourseSize}
                onChange={(e) => setCourseSettings(prev => ({
                  ...prev,
                  maxCourseSize: e.target.value
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoQuality">Default Video Quality</Label>
              <Select
                value={courseSettings.videoQuality}
                onValueChange={(value) => setCourseSettings(prev => ({
                  ...prev,
                  videoQuality: value
                }))}
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
                value={courseSettings.passGrade}
                onChange={(e) => setCourseSettings(prev => ({
                  ...prev,
                  passGrade: e.target.value
                }))}
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
                checked={courseSettings.allowDownloads}
                onCheckedChange={(checked) => setCourseSettings(prev => ({
                  ...prev,
                  allowDownloads: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Certificates</Label>
                <p className="text-sm text-bjj-gray">Generate certificates upon course completion</p>
              </div>
              <Switch
                checked={courseSettings.certificateEnabled}
                onCheckedChange={(checked) => setCourseSettings(prev => ({
                  ...prev,
                  certificateEnabled: checked
                }))}
              />
            </div>
          </div>

          <Button onClick={handleSaveCourse} className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Course Settings
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notification Settings
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
                checked={notificationSettings.enrollmentNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  enrollmentNotifications: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Progress Notifications</Label>
                <p className="text-sm text-bjj-gray">Notify about student progress milestones</p>
              </div>
              <Switch
                checked={notificationSettings.progressNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  progressNotifications: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Completion Notifications</Label>
                <p className="text-sm text-bjj-gray">Notify when students complete courses</p>
              </div>
              <Switch
                checked={notificationSettings.completionNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  completionNotifications: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reminder Notifications</Label>
                <p className="text-sm text-bjj-gray">Send reminder notifications to students</p>
              </div>
              <Switch
                checked={notificationSettings.reminderNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  reminderNotifications: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-bjj-gray">Send notifications via email</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({
                  ...prev,
                  emailNotifications: checked
                }))}
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications} className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
