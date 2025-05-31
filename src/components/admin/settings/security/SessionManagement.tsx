
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Monitor, 
  Smartphone,
  MapPin,
  Shield,
  LogOut,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ActiveSession {
  id: string;
  user: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  loginTime: string;
  lastActivity: string;
  status: "active" | "idle" | "suspicious";
}

export const SessionManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [sessionSettings, setSessionSettings] = useState({
    sessionTimeout: 8,
    idleTimeout: 30,
    maxConcurrentSessions: 3,
    forceLogoutInactive: true,
    trackSessionLocation: true,
    alertSuspiciousLogin: true,
    rememberMeDuration: 30
  });

  const [activeSessions] = useState<ActiveSession[]>([
    {
      id: "1",
      user: "john@adjja.com",
      device: "Desktop",
      browser: "Chrome 120.0",
      location: "Sydney, Australia",
      ipAddress: "203.45.67.89",
      loginTime: "2024-01-15 09:00:00",
      lastActivity: "2 minutes ago",
      status: "active"
    },
    {
      id: "2", 
      user: "sarah@adjja.com",
      device: "Mobile",
      browser: "Safari 17.0",
      location: "Melbourne, Australia", 
      ipAddress: "192.168.1.50",
      loginTime: "2024-01-15 08:30:00",
      lastActivity: "15 minutes ago",
      status: "idle"
    },
    {
      id: "3",
      user: "mike@adjja.com",
      device: "Tablet",
      browser: "Firefox 121.0",
      location: "Unknown Location",
      ipAddress: "203.89.45.12",
      loginTime: "2024-01-15 07:45:00",
      lastActivity: "5 minutes ago",
      status: "suspicious"
    }
  ]);

  const terminateSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Session Terminated",
        description: "User session has been successfully terminated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to terminate session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const terminateAllSessions = async (userId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "All Sessions Terminated",
        description: "All user sessions have been terminated",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to terminate all sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Shield className="h-4 w-4 text-green-500" />;
      case 'idle': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'suspicious': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Monitor className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-yellow-100 text-yellow-800';
      case 'suspicious': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="session-timeout">Session Timeout (hours)</Label>
              <Input 
                id="session-timeout" 
                type="number" 
                value={sessionSettings.sessionTimeout}
                onChange={(e) => setSessionSettings(prev => ({ 
                  ...prev, 
                  sessionTimeout: parseInt(e.target.value) 
                }))}
              />
              <p className="text-xs text-gray-500 mt-1">Auto-logout after inactivity</p>
            </div>

            <div>
              <Label htmlFor="idle-timeout">Idle Warning (minutes)</Label>
              <Input 
                id="idle-timeout" 
                type="number" 
                value={sessionSettings.idleTimeout}
                onChange={(e) => setSessionSettings(prev => ({ 
                  ...prev, 
                  idleTimeout: parseInt(e.target.value) 
                }))}
              />
              <p className="text-xs text-gray-500 mt-1">Show idle warning after</p>
            </div>

            <div>
              <Label htmlFor="max-sessions">Max Concurrent Sessions</Label>
              <Input 
                id="max-sessions" 
                type="number" 
                value={sessionSettings.maxConcurrentSessions}
                onChange={(e) => setSessionSettings(prev => ({ 
                  ...prev, 
                  maxConcurrentSessions: parseInt(e.target.value) 
                }))}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum sessions per user</p>
            </div>

            <div>
              <Label htmlFor="remember-duration">Remember Me Duration (days)</Label>
              <Input 
                id="remember-duration" 
                type="number" 
                value={sessionSettings.rememberMeDuration}
                onChange={(e) => setSessionSettings(prev => ({ 
                  ...prev, 
                  rememberMeDuration: parseInt(e.target.value) 
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Force Logout Inactive</h4>
                <p className="text-sm text-gray-600">Auto-logout idle sessions</p>
              </div>
              <Switch 
                checked={sessionSettings.forceLogoutInactive}
                onCheckedChange={(checked) => setSessionSettings(prev => ({ 
                  ...prev, 
                  forceLogoutInactive: checked 
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Track Location</h4>
                <p className="text-sm text-gray-600">Monitor session locations</p>
              </div>
              <Switch 
                checked={sessionSettings.trackSessionLocation}
                onCheckedChange={(checked) => setSessionSettings(prev => ({ 
                  ...prev, 
                  trackSessionLocation: checked 
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Suspicious Login Alerts</h4>
                <p className="text-sm text-gray-600">Alert on unusual logins</p>
              </div>
              <Switch 
                checked={sessionSettings.alertSuspiciousLogin}
                onCheckedChange={(checked) => setSessionSettings(prev => ({ 
                  ...prev, 
                  alertSuspiciousLogin: checked 
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions ({activeSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(session.status)}
                      {session.device === 'Desktop' && <Monitor className="h-4 w-4 text-gray-500" />}
                      {session.device === 'Mobile' && <Smartphone className="h-4 w-4 text-gray-500" />}
                      {session.device === 'Tablet' && <Monitor className="h-4 w-4 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-bjj-navy">{session.user}</h4>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{session.browser} on {session.device}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </div>
                        <div>IP: {session.ipAddress}</div>
                        <div>Login: {session.loginTime}</div>
                        <div>Last: {session.lastActivity}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => terminateSession(session.id)}
                      disabled={isLoading}
                    >
                      <LogOut className="h-3 w-3 mr-1" />
                      Terminate
                    </Button>
                    {session.status === 'suspicious' && (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => terminateAllSessions(session.user)}
                        disabled={isLoading}
                      >
                        Terminate All
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-bjj-navy">Session Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Active Sessions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-600">Idle Sessions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-gray-600">Suspicious</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2.5h</div>
              <div className="text-sm text-gray-600">Avg Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
