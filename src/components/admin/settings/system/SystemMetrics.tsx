
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RefreshCw, Cpu, HardDrive, Activity, Database } from "lucide-react";
import { useSystemMetrics } from "@/hooks/useSystemMetrics";

export const SystemMetrics = () => {
  const { metrics, isLoading, refreshMetrics } = useSystemMetrics();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Metrics
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshMetrics}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CPU Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-bjj-gold" />
              <span className="font-medium">CPU Usage</span>
            </div>
            <Progress value={metrics.cpu.usage} className="h-2" />
            <div className="text-sm text-bjj-gray space-y-1">
              <div>Usage: {metrics.cpu.usage.toFixed(1)}%</div>
              <div>Cores: {metrics.cpu.cores}</div>
              <div>Temperature: {metrics.cpu.temperature}°C</div>
            </div>
          </div>

          {/* Memory Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-bjj-gold" />
              <span className="font-medium">Memory Usage</span>
            </div>
            <Progress value={metrics.memory.percentage} className="h-2" />
            <div className="text-sm text-bjj-gray space-y-1">
              <div>Used: {metrics.memory.used.toFixed(1)} GB / {metrics.memory.total} GB</div>
              <div>Percentage: {metrics.memory.percentage.toFixed(1)}%</div>
            </div>
          </div>

          {/* Storage Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-bjj-gold" />
              <span className="font-medium">Storage Usage</span>
            </div>
            <Progress value={metrics.storage.percentage} className="h-2" />
            <div className="text-sm text-bjj-gray space-y-1">
              <div>Used: {metrics.storage.used} GB / {metrics.storage.total} GB</div>
              <div>Percentage: {metrics.storage.percentage}%</div>
            </div>
          </div>

          {/* Database Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-bjj-gold" />
              <span className="font-medium">Database</span>
            </div>
            <Progress value={(metrics.database.connections / metrics.database.maxConnections) * 100} className="h-2" />
            <div className="text-sm text-bjj-gray space-y-1">
              <div>Connections: {metrics.database.connections} / {metrics.database.maxConnections}</div>
              <div>Avg Query Time: {metrics.database.queryTime.toFixed(1)}ms</div>
            </div>
          </div>
        </div>

        {/* Network Stats */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-3">Network Traffic</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">{metrics.network.inbound} MB/s</div>
              <div className="text-sm text-green-600">Inbound</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">{metrics.network.outbound} MB/s</div>
              <div className="text-sm text-blue-600">Outbound</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
