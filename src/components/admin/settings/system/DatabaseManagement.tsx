
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  HardDrive,
  Activity,
  Clock
} from "lucide-react";

export const DatabaseManagement = () => {
  const databaseStats = [
    { label: "Total Size", value: "2.4 GB", icon: HardDrive },
    { label: "Active Connections", value: "12", icon: Activity },
    { label: "Queries/sec", value: "145", icon: RefreshCw },
    { label: "Last Backup", value: "2 hours ago", icon: Clock }
  ];

  const backupHistory = [
    {
      id: "1",
      date: "2024-01-15 02:00:00",
      type: "Full Backup",
      size: "2.1 GB",
      status: "completed",
      duration: "12 minutes"
    },
    {
      id: "2",
      date: "2024-01-14 02:00:00",
      type: "Full Backup",
      size: "2.0 GB",
      status: "completed",
      duration: "11 minutes"
    },
    {
      id: "3",
      date: "2024-01-13 02:00:00",
      type: "Full Backup",
      size: "1.9 GB",
      status: "completed",
      duration: "10 minutes"
    }
  ];

  const handleBackupNow = () => {
    console.log('Creating backup...');
    // Add backup logic here
  };

  const handleRestoreBackup = (backupId: string) => {
    console.log('Restoring backup:', backupId);
    // Add restore logic here
  };

  const handleDeleteBackup = (backupId: string) => {
    console.log('Deleting backup:', backupId);
    // Add delete logic here
  };

  const handleOptimizeDatabase = () => {
    console.log('Optimizing database...');
    // Add optimization logic here
  };

  return (
    <div className="space-y-6">
      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {databaseStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-bjj-gray">{stat.label}</p>
                  <p className="text-2xl font-bold text-bjj-navy">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-bjj-gold" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Database Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage by Table
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">students</span>
                <span className="text-bjj-gray">45% (1.1 GB)</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">attendance_records</span>
                <span className="text-bjj-gray">25% (600 MB)</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">courses</span>
                <span className="text-bjj-gray">15% (360 MB)</span>
              </div>
              <Progress value={15} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">payment_transactions</span>
                <span className="text-bjj-gray">10% (240 MB)</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Other tables</span>
                <span className="text-bjj-gray">5% (120 MB)</span>
              </div>
              <Progress value={5} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup Management
            </CardTitle>
            <Button onClick={handleBackupNow} className="bg-bjj-gold hover:bg-bjj-gold-dark">
              <Download className="h-4 w-4 mr-2" />
              Backup Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backupHistory.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Database className="h-8 w-8 text-bjj-navy" />
                  <div>
                    <div className="font-medium text-bjj-navy">{backup.type}</div>
                    <div className="text-sm text-bjj-gray">
                      {backup.date} • {backup.size} • {backup.duration}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500">
                    {backup.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreBackup(backup.id)}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Database Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4"
              onClick={handleOptimizeDatabase}
            >
              <div className="text-center">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-bjj-navy" />
                <div className="font-medium">Optimize Database</div>
                <div className="text-xs text-bjj-gray">Improve performance</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Activity className="h-6 w-6 mx-auto mb-2 text-bjj-navy" />
                <div className="font-medium">Analyze Tables</div>
                <div className="text-xs text-bjj-gray">Update statistics</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Trash2 className="h-6 w-6 mx-auto mb-2 text-bjj-navy" />
                <div className="font-medium">Clean Logs</div>
                <div className="text-xs text-bjj-gray">Remove old logs</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
