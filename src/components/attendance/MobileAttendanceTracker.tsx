
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Play, 
  Square, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Wifi,
  WifiOff,
  RotateCcw
} from "lucide-react";
import { useAttendanceSession } from "@/hooks/useAttendanceSession";
import { useClasses } from "@/hooks/useClasses";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export const MobileAttendanceTracker = () => {
  const { classes } = useClasses();
  const {
    currentSession,
    attendanceRecords,
    loading,
    offlineQueue,
    startSession,
    markAttendance,
    endSession,
    syncOfflineQueue
  } = useAttendanceSession();

  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleStartSession = async () => {
    if (selectedClassId) {
      await startSession(selectedClassId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'late': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      case 'early_departure': return 'bg-orange-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'late': return <Clock className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      case 'early_departure': return <AlertCircle className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;

  if (!currentSession) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-bjj-gold" />
              Start Attendance Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Class</label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.filter(c => c.status === 'Active').map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{cls.name}</span>
                        <span className="text-xs text-gray-500">
                          {cls.schedule} • {cls.location}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleStartSession}
              disabled={!selectedClassId || loading}
              className="w-full bg-bjj-gold hover:bg-bjj-gold-dark"
              size="lg"
            >
              {loading ? "Starting..." : "Start Session"}
            </Button>

            <div className="text-center text-sm text-gray-500">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Session Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{currentSession.class?.name}</CardTitle>
              <p className="text-sm text-gray-500">{currentSession.class?.location}</p>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              {offlineQueue > 0 && (
                <Badge variant="outline" className="text-xs">
                  {offlineQueue} pending
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
              <div className="text-xs text-gray-500">Present</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
              <div className="text-xs text-gray-500">Late</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
              <div className="text-xs text-gray-500">Absent</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Actions */}
      {!isOnline && offlineQueue > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-800">Working offline</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={syncOfflineQueue}
                className="text-orange-600 border-orange-300"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Roster */}
      <div className="space-y-2">
        {attendanceRecords.map((record) => (
          <Card 
            key={record.student_id}
            className="relative overflow-hidden"
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                {/* Profile Picture */}
                <Avatar className="w-12 h-12">
                  <AvatarImage src={record.student.profile_picture_url} />
                  <AvatarFallback className="bg-bjj-navy text-white">
                    {record.student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{record.student.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{record.student.belt}</span>
                    {record.student.stripes > 0 && (
                      <span>• {record.student.stripes} stripes</span>
                    )}
                  </div>
                  {record.late_minutes > 0 && (
                    <div className="text-xs text-yellow-600">
                      Late by {record.late_minutes} minutes
                    </div>
                  )}
                </div>

                {/* Sync Status */}
                {record.sync_status !== 'synced' && (
                  <div className="flex items-center">
                    {record.sync_status === 'pending' && (
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    )}
                    {record.sync_status === 'failed' && (
                      <div className="w-2 h-2 bg-red-400 rounded-full" />
                    )}
                  </div>
                )}
              </div>

              {/* Attendance Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {['present', 'late', 'absent', 'early_departure'].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={record.status === status ? "default" : "outline"}
                    className={`
                      h-10 text-xs transition-all duration-200 active:scale-95
                      ${record.status === status ? getStatusColor(status) + ' text-white' : ''}
                    `}
                    onClick={() => markAttendance(record.student_id, status as any)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {getStatusIcon(status)}
                      <span className="capitalize text-[10px]">
                        {status === 'early_departure' ? 'Early' : status}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* End Session */}
      <Card>
        <CardContent className="p-4">
          <Button
            onClick={endSession}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <Square className="w-4 h-4 mr-2" />
            End Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
