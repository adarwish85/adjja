
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Database, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  Activity,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export const SystemMetrics = () => {
  const systemStats = [
    {
      title: "CPU Usage",
      value: "45%",
      progress: 45,
      status: "normal",
      icon: Cpu,
      trend: "down",
      trendValue: "-5%"
    },
    {
      title: "Memory Usage",
      value: "68%",
      progress: 68,
      status: "warning",
      icon: MemoryStick,
      trend: "up",
      trendValue: "+12%"
    },
    {
      title: "Storage Usage",
      value: "34%",
      progress: 34,
      status: "normal",
      icon: HardDrive,
      trend: "up",
      trendValue: "+3%"
    },
    {
      title: "Database Size",
      value: "2.4 GB",
      progress: 24,
      status: "normal",
      icon: Database,
      trend: "up",
      trendValue: "+8%"
    }
  ];

  const performanceMetrics = [
    { label: "Response Time", value: "120ms", status: "good" },
    { label: "Uptime", value: "99.9%", status: "excellent" },
    { label: "Active Connections", value: "24", status: "normal" },
    { label: "Requests/min", value: "1.2K", status: "normal" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      case 'good': return 'text-green-600';
      case 'excellent': return 'text-green-700';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-red-500" /> : 
      <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* System Resource Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Resource Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemStats.map((stat) => (
              <div key={stat.title} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <stat.icon className="h-5 w-5 text-bjj-navy" />
                    <span className="font-medium text-bjj-navy">{stat.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getStatusColor(stat.status)}`}>
                      {stat.value}
                    </span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(stat.trend)}
                      <span className="text-xs text-bjj-gray">{stat.trendValue}</span>
                    </div>
                  </div>
                </div>
                <Progress 
                  value={stat.progress} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="text-center p-4 border rounded-lg">
                <h3 className="font-medium text-bjj-navy mb-2">{metric.label}</h3>
                <div className="text-2xl font-bold text-bjj-navy mb-2">{metric.value}</div>
                <Badge 
                  variant={metric.status === 'excellent' ? 'default' : 'outline'}
                  className={metric.status === 'excellent' ? 'bg-green-500' : ''}
                >
                  {metric.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">System Health Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="font-medium">Database Connection</span>
              </div>
              <Badge className="bg-green-500">Healthy</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="font-medium">File Storage</span>
              </div>
              <Badge className="bg-green-500">Healthy</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="font-medium">Email Service</span>
              </div>
              <Badge className="bg-yellow-500">Warning</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="font-medium">Payment Gateway</span>
              </div>
              <Badge className="bg-green-500">Healthy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
