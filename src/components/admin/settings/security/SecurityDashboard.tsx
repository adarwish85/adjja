
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle, Users, Key, Clock } from "lucide-react";

export const SecurityDashboard = () => {
  const securityMetrics = [
    {
      title: "Active Sessions",
      value: "12",
      status: "normal",
      icon: Users,
      description: "Current active user sessions"
    },
    {
      title: "Failed Login Attempts",
      value: "3",
      status: "warning",
      icon: AlertTriangle,
      description: "Failed attempts in last 24h"
    },
    {
      title: "2FA Enabled Users",
      value: "85%",
      status: "good",
      icon: Shield,
      description: "Users with 2FA enabled"
    },
    {
      title: "Password Strength",
      value: "Good",
      status: "good",
      icon: Key,
      description: "Average password security"
    }
  ];

  const recentSecurityEvents = [
    {
      type: "login_success",
      user: "admin@example.com",
      time: "2 minutes ago",
      status: "success"
    },
    {
      type: "password_change",
      user: "coach@example.com",
      time: "1 hour ago",
      status: "success"
    },
    {
      type: "failed_login",
      user: "unknown@example.com",
      time: "3 hours ago",
      status: "warning"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge className="bg-green-500">Success</Badge>;
      case 'warning': return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'danger': return <Badge className="bg-red-500">Danger</Badge>;
      default: return <Badge>Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-bjj-gray">{metric.title}</p>
                  <p className="text-2xl font-bold text-bjj-navy">{metric.value}</p>
                  <p className="text-xs text-bjj-gray mt-1">{metric.description}</p>
                </div>
                <div className={`p-2 rounded-full ${getStatusColor(metric.status)}`}>
                  <metric.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSecurityEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="font-medium text-bjj-navy">
                      {event.type.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-sm text-bjj-gray">{event.user}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(event.status)}
                  <span className="text-sm text-bjj-gray">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Security Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-bjj-navy" />
                <div className="font-medium">Review Permissions</div>
                <div className="text-xs text-bjj-gray">Check user access levels</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Key className="h-6 w-6 mx-auto mb-2 text-bjj-navy" />
                <div className="font-medium">Reset Passwords</div>
                <div className="text-xs text-bjj-gray">Force password resets</div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-bjj-navy" />
                <div className="font-medium">Security Audit</div>
                <div className="text-xs text-bjj-gray">Run security check</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
