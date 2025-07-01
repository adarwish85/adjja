
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Monitor, Smartphone, Tablet, MapPin, Clock, LogOut } from "lucide-react";

export const SessionManagement = () => {
  const activeSessions = [
    {
      id: "1",
      user: "Ahmed Darwish",
      email: "ahmed@example.com",
      device: "Chrome on Windows",
      location: "Cairo, Egypt",
      ip: "192.168.1.1",
      lastActive: "2 minutes ago",
      current: true,
      deviceType: "desktop"
    },
    {
      id: "2",
      user: "Coach Sarah",
      email: "sarah@example.com",
      device: "Safari on iPhone",
      location: "Alexandria, Egypt",
      ip: "192.168.1.2",
      lastActive: "15 minutes ago",
      current: false,
      deviceType: "mobile"
    },
    {
      id: "3",
      user: "Student John",
      email: "john@example.com",
      device: "Chrome on Android",
      location: "Giza, Egypt",
      ip: "192.168.1.3",
      lastActive: "1 hour ago",
      current: false,
      deviceType: "mobile"
    }
  ];

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const handleTerminateSession = (sessionId: string) => {
    console.log('Terminating session:', sessionId);
    // Add session termination logic here
  };

  const handleTerminateAllSessions = () => {
    console.log('Terminating all sessions');
    // Add bulk session termination logic here
  };

  return (
    <div className="space-y-6">
      {/* Session Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-bjj-gray">Active Sessions</p>
                <p className="text-2xl font-bold text-bjj-navy">12</p>
              </div>
              <Monitor className="h-8 w-8 text-bjj-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-bjj-gray">Mobile Sessions</p>
                <p className="text-2xl font-bold text-bjj-navy">8</p>
              </div>
              <Smartphone className="h-8 w-8 text-bjj-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-bjj-gray">Desktop Sessions</p>
                <p className="text-2xl font-bold text-bjj-navy">4</p>
              </div>
              <Monitor className="h-8 w-8 text-bjj-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-bjj-gray">Avg Session Time</p>
                <p className="text-2xl font-bold text-bjj-navy">45m</p>
              </div>
              <Clock className="h-8 w-8 text-bjj-gold" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-bjj-navy">Active Sessions</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTerminateAllSessions}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Terminate All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-bjj-navy">{session.user}</div>
                      <div className="text-sm text-bjj-gray">{session.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(session.deviceType)}
                      <span className="text-sm">{session.device}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-bjj-gray" />
                      <div>
                        <div className="text-sm">{session.location}</div>
                        <div className="text-xs text-bjj-gray">{session.ip}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-bjj-gray" />
                      <span className="text-sm">{session.lastActive}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {session.current ? (
                      <Badge className="bg-green-500">Current</Badge>
                    ) : (
                      <Badge variant="outline">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {!session.current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
