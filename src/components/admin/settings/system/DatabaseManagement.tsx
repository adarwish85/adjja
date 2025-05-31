
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Play, Square, RefreshCw, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DatabaseOperation {
  id: string;
  name: string;
  status: "running" | "completed" | "failed" | "scheduled";
  progress: number;
  startTime: string;
  duration: string;
  type: "backup" | "optimization" | "cleanup" | "migration";
}

export const DatabaseManagement = () => {
  const { toast } = useToast();
  const [operations, setOperations] = useState<DatabaseOperation[]>([
    {
      id: "1",
      name: "Daily Backup",
      status: "completed",
      progress: 100,
      startTime: "02:00 AM",
      duration: "5m 32s",
      type: "backup"
    },
    {
      id: "2", 
      name: "Index Optimization",
      status: "running",
      progress: 65,
      startTime: "10:30 AM",
      duration: "2m 15s",
      type: "optimization"
    },
    {
      id: "3",
      name: "Log Cleanup",
      status: "scheduled",
      progress: 0,
      startTime: "11:00 PM",
      duration: "-",
      type: "cleanup"
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const runOperation = async (operationId: string, operationType: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setOperations(prev => prev.map(op => 
        op.id === operationId 
          ? { ...op, status: "running" as const, progress: 0 }
          : op
      ));

      toast({
        title: "Operation Started",
        description: `${operationType} operation has been started successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to start ${operationType} operation`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopOperation = async (operationId: string) => {
    try {
      setOperations(prev => prev.map(op => 
        op.id === operationId 
          ? { ...op, status: "failed" as const }
          : op
      ));

      toast({
        title: "Operation Stopped",
        description: "Operation has been stopped successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop operation",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "scheduled": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "backup": return <Download className="h-4 w-4" />;
      case "optimization": return <RefreshCw className="h-4 w-4" />;
      case "cleanup": return <Trash2 className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-bjj-navy flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Operations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {operations.map((operation) => (
            <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(operation.type)}
                  <span className="font-medium">{operation.name}</span>
                </div>
                <Badge variant="outline" className={`${getStatusColor(operation.status)} text-white`}>
                  {operation.status}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-bjj-gray">
                  <div>Start: {operation.startTime}</div>
                  <div>Duration: {operation.duration}</div>
                </div>
                
                {operation.status === "running" && (
                  <div className="w-24">
                    <div className="text-xs text-bjj-gray mb-1">{operation.progress}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-bjj-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${operation.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {operation.status === "scheduled" || operation.status === "failed" ? (
                    <Button
                      size="sm"
                      onClick={() => runOperation(operation.id, operation.name)}
                      disabled={isLoading}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  ) : operation.status === "running" ? (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => stopOperation(operation.id)}
                    >
                      <Square className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <Button 
            onClick={() => runOperation("new", "Manual Backup")}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Create Backup
          </Button>
          <Button 
            variant="outline"
            onClick={() => runOperation("new", "Optimization")}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Optimize Database
          </Button>
          <Button 
            variant="outline"
            onClick={() => runOperation("new", "Cleanup")}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clean Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
