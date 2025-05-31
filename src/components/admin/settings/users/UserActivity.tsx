
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Activity, 
  Search, 
  Download,
  Filter,
  Calendar,
  User,
  Shield,
  Settings,
  Eye
} from "lucide-react";

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  category: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: "success" | "failed" | "warning";
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Smith",
    action: "User Login",
    category: "Authentication",
    details: "Successful login from Chrome on Windows",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0",
    timestamp: "2024-01-22T10:30:00Z",
    status: "success"
  },
  {
    id: "2",
    userId: "2",
    userName: "Sarah Wilson",
    action: "Role Updated",
    category: "User Management",
    details: "Role changed from Coach to Admin",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox 121.0.0",
    timestamp: "2024-01-22T09:15:00Z",
    status: "success"
  },
  {
    id: "3",
    userId: "3",
    userName: "Mike Johnson",
    action: "Failed Login",
    category: "Authentication",
    details: "Invalid password attempt",
    ipAddress: "192.168.1.102",
    userAgent: "Safari 17.0.0",
    timestamp: "2024-01-22T08:45:00Z",
    status: "failed"
  },
  {
    id: "4",
    userId: "1",
    userName: "John Smith",
    action: "Settings Modified",
    category: "System",
    details: "Updated academy general settings",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0",
    timestamp: "2024-01-22T08:30:00Z",
    status: "success"
  },
  {
    id: "5",
    userId: "4",
    userName: "Emma Davis",
    action: "Permission Granted",
    category: "User Management",
    details: "Granted manage_students permission",
    ipAddress: "192.168.1.103",
    userAgent: "Chrome 120.0.0",
    timestamp: "2024-01-22T07:20:00Z",
    status: "warning"
  }
];

export const UserActivity = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState("today");

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || log.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Authentication": return <Shield className="h-4 w-4" />;
      case "User Management": return <User className="h-4 w-4" />;
      case "System": return <Settings className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "User", "Action", "Category", "Status", "Details", "IP Address"],
      ...filteredLogs.map(log => [
        formatTimestamp(log.timestamp),
        log.userName,
        log.action,
        log.category,
        log.status,
        log.details,
        log.ipAddress
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-activity-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Today's Logins</div>
                <div className="text-xl font-bold text-green-600">24</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Activity className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Failed Attempts</div>
                <div className="text-xl font-bold text-red-600">3</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Users</div>
                <div className="text-xl font-bold text-blue-600">18</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Settings className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">System Changes</div>
                <div className="text-xl font-bold text-yellow-600">7</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Activity Logs
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={exportLogs}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search activity logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Authentication">Authentication</SelectItem>
                <SelectItem value="User Management">User Management</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.userName}</div>
                      <div className="text-xs text-gray-500">{log.userAgent}</div>
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(log.category)}
                        <span className="text-sm">{log.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate">
                      {log.details}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {log.ipAddress}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredLogs.length} of {activityLogs.length} logs
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
