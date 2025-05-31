
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock,
  TrendingUp,
  RefreshCw,
  Ban
} from "lucide-react";
import { useSecurityMonitoring } from "@/hooks/useSecurityMonitoring";

export const SecurityDashboard = () => {
  const { events, metrics, isLoading, refreshEvents, blockIP, resolveEvent } = useSecurityMonitoring();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'open': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-bjj-navy">{metrics.totalEvents}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Events</p>
                <p className="text-2xl font-bold text-red-600">{metrics.criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Logins</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.failedLogins}</p>
              </div>
              <Lock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspicious Activity</p>
                <p className="text-2xl font-bold text-yellow-600">{metrics.suspiciousActivities}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blocked IPs</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.blockedIPs}</p>
              </div>
              <Ban className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Threats</p>
                <p className="text-2xl font-bold text-red-600">{metrics.activeThreats}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Threat Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Threat Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Security Score</span>
              <Badge className="bg-green-100 text-green-800">85/100 - Good</Badge>
            </div>
            <Progress value={85} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-green-600">✓ 2FA Enabled</p>
                <p className="font-medium text-green-600">✓ SSL Certificate Valid</p>
                <p className="font-medium text-green-600">✓ Regular Backups</p>
              </div>
              <div>
                <p className="font-medium text-yellow-600">⚠ Some Failed Login Attempts</p>
                <p className="font-medium text-red-600">✗ IP Whitelist Not Configured</p>
                <p className="font-medium text-yellow-600">⚠ Password Policy Could Be Stronger</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Security Events
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshEvents}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-500">{event.timestamp}</span>
                    </div>
                    <h4 className="font-medium text-bjj-navy">{event.event}</h4>
                    <p className="text-sm text-gray-600 mt-1">{event.details}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs text-gray-500">
                      <div><strong>User:</strong> {event.user}</div>
                      <div><strong>IP:</strong> {event.ipAddress}</div>
                      <div><strong>Location:</strong> {event.location}</div>
                      <div><strong>Browser:</strong> {event.userAgent.split(' ')[0]}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    {event.status !== 'resolved' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => resolveEvent(event.id)}
                        disabled={isLoading}
                      >
                        Resolve
                      </Button>
                    )}
                    {event.severity === 'high' || event.severity === 'critical' ? (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => blockIP(event.ipAddress)}
                        disabled={isLoading}
                      >
                        <Ban className="h-3 w-3 mr-1" />
                        Block IP
                      </Button>
                    ) : null}
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
