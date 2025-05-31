
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Download, 
  Plus,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Mail,
  Settings,
  Eye,
  Copy,
  Trash2
} from "lucide-react";

export const CustomReports = () => {
  const savedReports = [
    {
      id: 1,
      name: "Monthly Revenue Summary",
      type: "Revenue",
      frequency: "Monthly",
      lastRun: "2024-01-01",
      status: "active",
      recipients: ["admin@bjj.com", "finance@bjj.com"]
    },
    {
      id: 2,
      name: "Student Attendance Report",
      type: "Performance",
      frequency: "Weekly",
      lastRun: "2024-01-08",
      status: "active",
      recipients: ["instructors@bjj.com"]
    },
    {
      id: 3,
      name: "Instructor Performance",
      type: "Performance",
      frequency: "Monthly",
      lastRun: "2024-01-01",
      status: "paused",
      recipients: ["management@bjj.com"]
    },
    {
      id: 4,
      name: "New Student Analytics",
      type: "Students",
      frequency: "Bi-weekly",
      lastRun: "2023-12-28",
      status: "active",
      recipients: ["marketing@bjj.com"]
    }
  ];

  const reportTemplates = [
    { name: "Revenue Analysis", icon: DollarSign, description: "Comprehensive revenue breakdown and trends" },
    { name: "Student Demographics", icon: Users, description: "Student enrollment and demographic analysis" },
    { name: "Class Performance", icon: BarChart3, description: "Class attendance and instructor performance" },
    { name: "Custom Dashboard", icon: FileText, description: "Create a custom analytics dashboard" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Report
          </CardTitle>
          <p className="text-sm text-bjj-gray">Build custom reports with your preferred metrics and filters</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-bjj-navy">Report Name</label>
              <Input placeholder="Enter report name..." className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-bjj-navy">Report Type</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Analytics</SelectItem>
                  <SelectItem value="students">Student Analytics</SelectItem>
                  <SelectItem value="performance">Performance Analytics</SelectItem>
                  <SelectItem value="custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-bjj-navy">Date Range</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7">Last 7 days</SelectItem>
                  <SelectItem value="last30">Last 30 days</SelectItem>
                  <SelectItem value="last90">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-bjj-navy">Frequency</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-bjj-navy">Format</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="email">Email Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-bjj-navy mb-3 block">Include Metrics</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Revenue", "Student Count", "Attendance", "Instructor Rating",
                "Class Completion", "Payment Success", "Retention Rate", "Growth Rate"
              ].map((metric) => (
                <div key={metric} className="flex items-center space-x-2">
                  <Checkbox id={metric} />
                  <label htmlFor={metric} className="text-sm text-bjj-gray">{metric}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
              Create Report
            </Button>
            <Button variant="outline">
              Save as Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Quick Start Templates</CardTitle>
          <p className="text-sm text-bjj-gray">Use pre-built templates to get started quickly</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTemplates.map((template, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-bjj-gold/10 rounded-lg">
                    <template.icon className="h-5 w-5 text-bjj-gold-dark" />
                  </div>
                  <h3 className="font-medium text-bjj-navy">{template.name}</h3>
                </div>
                <p className="text-sm text-bjj-gray">{template.description}</p>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Saved Reports</CardTitle>
          <p className="text-sm text-bjj-gray">Manage your scheduled and saved reports</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {savedReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-bjj-navy">{report.name}</h3>
                    <p className="text-sm text-bjj-gray">
                      {report.type} • {report.frequency} • Last run: {report.lastRun}
                    </p>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-bjj-gray">
                    Recipients: {report.recipients.join(", ")}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
