
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Search, 
  Download, 
  RefreshCw, 
  Filter,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export const LogViewer = () => {
  const [selectedLogType, setSelectedLogType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const logTypes = [
    { value: "all", label: "All Logs" },
    { value: "error", label: "Error Logs" },
    { value: "access", label: "Access Logs" },
    { value: "security", label: "Security Logs" },
    { value: "database", label: "Database Logs" },
    { value: "system", label: "System Logs" }
  ];

  const logEntries = [
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      level: "error",
      source: "database",
      message: "Connection timeout to database server",
      details: "PostgreSQL connection failed after 30 seconds",
      user: "system"
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:28:15",
      level: "info",
      source: "auth",
      message: "User login successful",
      details: "User ahmed@example.com logged in from 192.168.1.1",
      user: "ahmed@example.com"
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:25:42",
      level: "warning",
      source: "security",
      message: "Multiple failed login attempts",
      details: "5 failed login attempts for user john@example.com from IP 192.168.1.100",
      user: "john@example.com"
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:22:10",
      level: "info",
      source: "system",
      message: "Backup completed successfully",
      details: "Database backup completed in 12 minutes, size: 2.1 GB",
      user: "system"
    },
    {
      id: "5",
      timestamp: "2024-01-15 14:18:33",
      level: "error",
      source: "payment",
      message: "Payment processing failed",
      details: "Stripe payment failed for order #12345: Card declined",
      user: "customer@example.com"
    }
  ];

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLogBadge = (level: string) => {
    switch (level) {
      case 'error': return <Badge className="bg-red-500">Error</Badge>;
      case 'warning': return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'info': return <Badge className="bg-blue-500">Info</Badge>;
      case 'success': return <Badge className="bg-green-500">Success</Badge>;
      default: return <Badge variant="outline">Log</Badge>;
    }
  };

  const filteredLogs = logEntries.filter(log => {
    const matchesType = selectedLogType === "all" || log.level === selectedLogType || log.source === selectedLogType;
    const matchesSearch = searchTerm === "" || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportLogs = () => {
    console.log('Exporting logs...');
    // Add export logic here
  };

  const handleRefreshLogs = () => {
    console.log('Refreshing logs...');
    // Add refresh logic here
  };

  return (
    <div className="space-y-6">
      {/* Log Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <FileText className="h-5 w-5" />
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="h-4 w-4 text-bjj-gray" />
              <Select value={selectedLogType} onValueChange={setSelectedLogType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select log type" />
                </SelectTrigger>
                <SelectContent>
                  {logTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-bjj-gray" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefreshLogs}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportLogs}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Log Entries</span>
              <Badge variant="outline">{filteredLogs.length} entries</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getLogIcon(log.level)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-bjj-navy">{log.message}</span>
                          {getLogBadge(log.level)}
                        </div>
                        <p className="text-sm text-bjj-gray mb-2">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-bjj-gray">
                          <span>{log.timestamp}</span>
                          <span>Source: {log.source}</span>
                          <span>User: {log.user}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
