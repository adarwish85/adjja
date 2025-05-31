
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  HardDrive, 
  Cloud, 
  Download,
  Upload,
  Clock,
  RefreshCw
} from "lucide-react";
import { useSettings, BackupSettings as BackupSettingsType } from "@/hooks/useSettings";

export const BackupSettings = () => {
  const { defaultBackupSettings, saveBackupSettings, createManualBackup, isLoading } = useSettings();
  const [settings, setSettings] = useState<BackupSettingsType>(defaultBackupSettings);

  const backupHistory = [
    { date: "2024-01-15 02:00", type: "Full Backup", size: "2.4 GB", status: "Success", location: "AWS S3" },
    { date: "2024-01-14 02:00", type: "Incremental", size: "156 MB", status: "Success", location: "AWS S3" },
    { date: "2024-01-13 02:00", type: "Incremental", size: "203 MB", status: "Success", location: "AWS S3" },
    { date: "2024-01-12 02:00", type: "Incremental", size: "178 MB", status: "Failed", location: "AWS S3" },
    { date: "2024-01-11 02:00", type: "Incremental", size: "245 MB", status: "Success", location: "AWS S3" },
  ];

  const handleSave = async () => {
    await saveBackupSettings(settings);
  };

  const handleReset = () => {
    setSettings(defaultBackupSettings);
  };

  const handleManualBackup = async (type: "full" | "database" | "files") => {
    await createManualBackup(type);
  };

  return (
    <div className="space-y-6">
      {/* Backup Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Automatic Backups</h4>
              <p className="text-sm text-bjj-gray">Automatically backup data on schedule</p>
            </div>
            <Switch 
              checked={settings.enableAutoBackup}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableAutoBackup: checked }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Select 
                value={settings.backupFrequency} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, backupFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="backup-time">Backup Time</Label>
              <Input 
                id="backup-time" 
                type="time" 
                value={settings.backupTime}
                onChange={(e) => setSettings(prev => ({ ...prev, backupTime: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="backup-retention">Retention Period (days)</Label>
            <Input 
              id="backup-retention" 
              type="number" 
              value={settings.retentionPeriod}
              onChange={(e) => setSettings(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
              className="max-w-sm" 
            />
            <p className="text-xs text-bjj-gray mt-1">How long to keep backup files</p>
          </div>
        </CardContent>
      </Card>

      {/* Backup Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Backup Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Database Backup</h4>
              <p className="text-sm text-bjj-gray">Backup all database tables and data</p>
            </div>
            <Switch 
              checked={settings.enableDatabaseBackup}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableDatabaseBackup: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">File Storage Backup</h4>
              <p className="text-sm text-bjj-gray">Backup uploaded files and documents</p>
            </div>
            <Switch 
              checked={settings.enableFileBackup}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableFileBackup: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Configuration Backup</h4>
              <p className="text-sm text-bjj-gray">Backup system settings and configurations</p>
            </div>
            <Switch 
              checked={settings.enableConfigBackup}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableConfigBackup: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Incremental Backups</h4>
              <p className="text-sm text-bjj-gray">Only backup changed data between full backups</p>
            </div>
            <Switch 
              checked={settings.enableIncrementalBackup}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableIncrementalBackup: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Storage Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Storage Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primary-storage">Primary Storage</Label>
            <Select 
              value={settings.primaryStorage} 
              onValueChange={(value) => setSettings(prev => ({ ...prev, primaryStorage: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aws-s3">AWS S3</SelectItem>
                <SelectItem value="google-cloud">Google Cloud Storage</SelectItem>
                <SelectItem value="azure-blob">Azure Blob Storage</SelectItem>
                <SelectItem value="local">Local Storage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="s3-bucket">S3 Bucket Name</Label>
              <Input 
                id="s3-bucket" 
                value={settings.s3Bucket}
                onChange={(e) => setSettings(prev => ({ ...prev, s3Bucket: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="s3-region">S3 Region</Label>
              <Input 
                id="s3-region" 
                value={settings.s3Region}
                onChange={(e) => setSettings(prev => ({ ...prev, s3Region: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enable Backup Encryption</h4>
              <p className="text-sm text-bjj-gray">Encrypt backup files before storage</p>
            </div>
            <Switch 
              checked={settings.enableBackupEncryption}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableBackupEncryption: checked }))}
            />
          </div>
          <Button variant="outline">
            <Cloud className="h-4 w-4 mr-2" />
            Test Connection
          </Button>
        </CardContent>
      </Card>

      {/* Manual Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Manual Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-bjj-gray">Create an immediate backup of your system data</p>
          <div className="flex space-x-4">
            <Button 
              className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy"
              onClick={() => handleManualBackup("full")}
              disabled={isLoading}
            >
              <Database className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Full Backup"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleManualBackup("database")}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Database Only
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleManualBackup("files")}
              disabled={isLoading}
            >
              <HardDrive className="h-4 w-4 mr-2" />
              Files Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Restore Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Restore Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-bjj-gray">Restore your system from a previous backup</p>
          <div>
            <Label htmlFor="restore-file">Select Backup File</Label>
            <Input id="restore-file" type="file" accept=".sql,.zip,.tar.gz" />
          </div>
          <Button variant="destructive">
            <Upload className="h-4 w-4 mr-2" />
            Start Restore Process
          </Button>
          <p className="text-xs text-red-600">⚠️ This will overwrite current data. Make sure to backup current state first.</p>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backupHistory.map((backup, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`h-2 w-2 rounded-full ${
                    backup.status === 'Success' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-bjj-navy">{backup.type}</p>
                    <p className="text-sm text-bjj-gray">{backup.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-bjj-gray">{backup.size}</span>
                  <Badge variant={backup.status === 'Success' ? 'default' : 'destructive'}>
                    {backup.status}
                  </Badge>
                  <span className="text-sm text-bjj-gray">{backup.location}</span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Backup History
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
          {isLoading ? "Saving..." : "Save Backup Settings"}
        </Button>
      </div>
    </div>
  );
};
