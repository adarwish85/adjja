
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw, User, Shield, CheckCircle, Database } from "lucide-react";
import { useAuthDebug } from "@/hooks/useAuthDebug";
import { useAuth } from "@/hooks/useAuth";

export const SessionDebugPanel = () => {
  const { debugInfo, runAuthDebug, refreshSession } = useAuthDebug();
  const { signOut } = useAuth();

  const handleForceSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Session Debug Panel
        </CardTitle>
        <p className="text-sm text-orange-700">
          Debugging authentication session issues
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">User ID</span>
            </div>
            <Badge variant={debugInfo.currentUserId ? "default" : "destructive"}>
              {debugInfo.currentUserId ? "Present" : "Missing"}
            </Badge>
            {debugInfo.currentUserId && (
              <p className="text-xs text-gray-600 break-all">
                {debugInfo.currentUserId}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Role</span>
            </div>
            <Badge variant={debugInfo.currentRole ? "default" : "destructive"}>
              {debugInfo.currentRole || "Missing"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Session</span>
            </div>
            <Badge variant={debugInfo.sessionValid ? "default" : "destructive"}>
              {debugInfo.sessionValid ? "Valid" : "Invalid"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">DB Session</span>
            </div>
            <Badge variant={debugInfo.dbSessionInfo?.session_valid ? "default" : "destructive"}>
              {debugInfo.dbSessionInfo?.session_valid ? "Valid" : "Invalid"}
            </Badge>
          </div>
        </div>

        {debugInfo.dbSessionInfo && (
          <div className="p-3 bg-white rounded border">
            <h4 className="font-medium text-sm mb-2">Database Session Details:</h4>
            <div className="text-xs space-y-1">
              <div>Auth UID: {debugInfo.dbSessionInfo.auth_uid || "NULL"}</div>
              <div>Session Valid: {debugInfo.dbSessionInfo.session_valid ? "TRUE" : "FALSE"}</div>
              <div>Timestamp: {debugInfo.dbSessionInfo.current_timestamp}</div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={runAuthDebug}
            disabled={debugInfo.isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${debugInfo.isLoading ? 'animate-spin' : ''}`} />
            Re-run Debug
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshSession}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Session
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleForceSignOut}
          >
            Force Sign Out & Reload
          </Button>
        </div>

        {!debugInfo.sessionValid && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Session Issue Detected:</strong> Your authentication session appears to be invalid. 
              Try refreshing the session or signing out and back in.
            </p>
          </div>
        )}

        {debugInfo.dbSessionInfo && !debugInfo.dbSessionInfo.session_valid && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Database Session Issue:</strong> The database cannot see your session. 
              This is likely causing the missing students issue.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
