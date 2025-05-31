
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { QRCodeSVG } from 'qrcode.react';
import { 
  UserCheck, 
  Shield, 
  Smartphone,
  Key,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TwoFactorAuth = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [backupCodes] = useState([
    "123456789", "987654321", "456789123", "789123456", 
    "321654987", "654987321", "159753468", "357159486"
  ]);

  const [settings, setSettings] = useState({
    require2FAAdmin: true,
    require2FACoaches: false,
    require2FAStudents: false,
    gracePeriodDays: 7,
    allowBackupCodes: true,
    allowSMSBackup: true
  });

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Generate a sample TOTP secret
      const secret = "JBSWY3DPEHPK3PXP";
      const appName = "ADJJA Academy";
      const userEmail = "admin@adjja.com";
      const otpauth = `otpauth://totp/${appName}:${userEmail}?secret=${secret}&issuer=${appName}`;
      setQrCode(otpauth);
      
      toast({
        title: "QR Code Generated",
        description: "Scan this code with your authenticator app",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const verifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled",
      });
      setVerificationCode("");
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const users2FAStatus = [
    { name: "John Smith", email: "john@adjja.com", role: "Admin", status: "enabled", lastUsed: "2 hours ago" },
    { name: "Sarah Jones", email: "sarah@adjja.com", role: "Coach", status: "enabled", lastUsed: "1 day ago" },
    { name: "Mike Wilson", email: "mike@adjja.com", role: "Coach", status: "pending", lastUsed: "Never" },
    { name: "Emma Davis", email: "emma@adjja.com", role: "Student", status: "disabled", lastUsed: "Never" },
  ];

  return (
    <div className="space-y-6">
      {/* 2FA Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Two-Factor Authentication Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Require for Admins</h4>
                <p className="text-sm text-gray-600">Force all admin users to enable 2FA</p>
              </div>
              <Switch 
                checked={settings.require2FAAdmin}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require2FAAdmin: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Require for Coaches</h4>
                <p className="text-sm text-gray-600">Force all coaches to enable 2FA</p>
              </div>
              <Switch 
                checked={settings.require2FACoaches}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require2FACoaches: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Require for Students</h4>
                <p className="text-sm text-gray-600">Force all students to enable 2FA</p>
              </div>
              <Switch 
                checked={settings.require2FAStudents}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require2FAStudents: checked }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="grace-period">Grace Period (days)</Label>
              <Input 
                id="grace-period" 
                type="number" 
                value={settings.gracePeriodDays}
                onChange={(e) => setSettings(prev => ({ ...prev, gracePeriodDays: parseInt(e.target.value) }))}
              />
              <p className="text-xs text-gray-500 mt-1">Time users have to enable 2FA</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Allow Backup Codes</h4>
                <p className="text-sm text-gray-600">Enable backup recovery codes</p>
              </div>
              <Switch 
                checked={settings.allowBackupCodes}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowBackupCodes: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Backup</h4>
                <p className="text-sm text-gray-600">Allow SMS as backup method</p>
              </div>
              <Switch 
                checked={settings.allowSMSBackup}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowSMSBackup: checked }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setup 2FA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Setup Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Step 1: Generate QR Code</h4>
                <Button 
                  onClick={generateQRCode} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  <Key className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate QR Code"}
                </Button>
              </div>

              {qrCode && (
                <div className="border rounded-lg p-4 text-center">
                  <QRCodeSVG value={qrCode} size={200} className="mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Scan this QR code with Google Authenticator, Authy, or any TOTP app
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Step 2: Verify Setup</h4>
                <Label htmlFor="verification-code">Enter 6-digit code from your app</Label>
                <Input 
                  id="verification-code"
                  type="text" 
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
                <Button 
                  onClick={verifySetup}
                  disabled={!verificationCode || verificationCode.length !== 6}
                  className="w-full mt-2"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Verify & Enable 2FA
                </Button>
              </div>

              {settings.allowBackupCodes && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Backup Recovery Codes</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Save these codes in a safe place. Each can only be used once.
                  </p>
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded border">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users 2FA Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Users 2FA Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users2FAStatus.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`h-3 w-3 rounded-full ${
                    user.status === 'enabled' ? 'bg-green-500' : 
                    user.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="font-medium text-bjj-navy">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email} • {user.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <Badge className={
                      user.status === 'enabled' ? 'bg-green-100 text-green-800' :
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {user.status === 'enabled' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {user.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {user.status.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">Last used: {user.lastUsed}</p>
                  </div>
                  {user.status === 'pending' && (
                    <Button size="sm" variant="outline">
                      Send Reminder
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
