
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Search, Download, RefreshCw } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  category: string;
  message: string;
  source: string;
}

export const LogViewer = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState({
    level: "all",
    category: "all",
    search: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sample log data
  useEffect(() => {
    const sampleLogs: LogEntry[] = [
      {
        id: "1",
        timestamp: "2024-01-20 10:30:15",
        level: "info",
        category: "Authentication",
        message: "User login successful for user@example.com",
        source: "auth.service"
      },
      {
        id: "2",
        timestamp: "2024-01-20 10:28:42",
        level: "warning",
        category: "Database",
        message: "Query execution time exceeded 5 seconds",
        source: "db.connection"
      },
      {
        id: "3",
        timestamp: "2024-01-20 10:25:33",
        level: "error",
        category: "Payment",
        message: "Payment processing failed for order #12345",
        source: "payment.processor"
      },
      {
        id: "4",
        timestamp: "2024-01-20 10:22:18",
        level: "info",
        category: "System",
        message: "Backup process completed successfully",
        source: "backup.service"
      },
      {
        id: "5",
        timestamp: "2024-01-20 10:20:05",
        level: "debug",
        category: "API",
        message: "Rate limit check passed for IP 192.168.1.100",
        source: "api.middleware"
      }
    ];
    setLogs(sampleLogs);
    setFilteredLogs(sampleLogs);
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (filter.level !== "all") {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter.category !== "all") {
      filtered = filtered.filter(log => log.category === filter.category);
    }

    if (filter.search) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(filter.search.toLowerCase()) ||
        log.source.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, filter]);

  const refreshLogs = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, this would fetch fresh logs from the server
    } catch (error) {
      console.error('Error refreshing logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportLogs = () => {
    const logData = filteredLogs.map(log => 
      `${log.timestamp} [${log.level.toUpperCase()}] ${log.category}: ${log.message} (${log.source})`
    ).join('\n');
    
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "bg-red-500";
      case "warning": return "bg-yellow-500";
      case "info": return "bg-blue-500";
      case "debug": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const categories = [...new Set(logs.map(log => log.category))];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Logs
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refreshLogs} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search logs..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="max-w-sm"
            />
          </div>
          <Select value={filter.level} onValueChange={(value) => setFilter(prev => ({ ...prev, level: value }))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="debug">Debug</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filter.category} onValueChange={(value) => setFilter(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Log entries */}
        <ScrollArea className="h-96 border rounded-lg">
          <div className="space-y-2 p-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <Badge className={`${getLevelColor(log.level)} text-white text-xs`}>
                  {log.level}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{log.category}</span>
                    <span className="text-xs text-bjj-gray">{log.timestamp}</span>
                    <span className="text-xs text-bjj-gray">({log.source})</span>
                  </div>
                  <p className="text-sm text-gray-700">{log.message}</p>
                </div>
              </div>
            ))}
            {filteredLogs.length === 0 && (
              <div className="text-center py-8 text-bjj-gray">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No logs found matching your filters</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-4 flex justify-between items-center text-sm text-bjj-gray">
          <span>Showing {filteredLogs.length} of {logs.length} entries</span>
          <span>Logs are retained for 30 days</span>
        </div>
      </CardContent>
    </Card>
  );
};
