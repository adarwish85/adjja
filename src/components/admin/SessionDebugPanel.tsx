
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw, User, Shield, CheckCircle, Database, Users } from "lucide-react";
import { useAuthDebug } from "@/hooks/useAuthDebug";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  approval_status: string;
  role_name?: string;
  has_student_record: boolean;
}

export const SessionDebugPanel = () => {
  const { debugInfo, runAuthDebug, refreshSession } = useAuthDebug();
  const { signOut } = useAuth();
  const [profilesData, setProfilesData] = useState<ProfileData[]>([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleForceSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  const loadAllData = async () => {
    try {
      setIsLoadingData(true);
      console.log('🔍 SessionDebugPanel: Loading comprehensive data analysis...');
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          approval_status,
          user_roles (
            name
          )
        `);

      if (profilesError) {
        console.error('SessionDebugPanel: Error fetching profiles:', profilesError);
        throw profilesError;
      }

      // Get all student records
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*');

      if (studentsError) {
        console.error('SessionDebugPanel: Error fetching students:', studentsError);
        throw studentsError;
      }

      console.log('📊 SessionDebugPanel: Profiles found:', profiles?.length || 0);
      console.log('📊 SessionDebugPanel: Student records found:', students?.length || 0);
      console.log('👥 SessionDebugPanel: All profiles:', profiles);
      console.log('🎓 SessionDebugPanel: All students:', students);

      // Enhanced logging for each student
      if (students && students.length > 0) {
        console.log('🎓 SessionDebugPanel: Individual student records:');
        students.forEach((student, index) => {
          console.log(`🎓 Debug Student ${index + 1}:`, {
            id: student.id,
            name: student.name,
            email: student.email,
            status: student.status,
            auth_user_id: student.auth_user_id,
            fullRecord: student
          });
        });
      }

      const existingStudentIds = new Set(students?.map(s => s.auth_user_id) || []);
      
      // Map profiles with student record status
      const profilesWithStatus = profiles?.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        approval_status: profile.approval_status,
        role_name: profile.user_roles?.name,
        has_student_record: existingStudentIds.has(profile.id)
      })) || [];

      setProfilesData(profilesWithStatus);
      setStudentsCount(students?.length || 0);
      
      console.log('📋 SessionDebugPanel: Analysis complete:', profilesWithStatus);
      toast.success(`Analysis complete: ${profiles?.length || 0} profiles, ${students?.length || 0} student records`);
      
    } catch (error) {
      console.error('SessionDebugPanel: Error loading data:', error);
      toast.error("Failed to load comprehensive data");
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <CardTitle className="text-red-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Enhanced Debug Panel - Investigation Mode
        </CardTitle>
        <p className="text-sm text-red-700">
          🔍 Investigating student rendering issue - Database vs UI discrepancy
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
            variant="outline"
            size="sm"
            onClick={loadAllData}
            disabled={isLoadingData}
            className="bg-red-100 hover:bg-red-200"
          >
            <Users className={`h-4 w-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
            🔍 Analyze All Data
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleForceSignOut}
          >
            Force Sign Out & Reload
          </Button>
        </div>

        {profilesData.length > 0 && (
          <div className="p-3 bg-white border rounded">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              🔍 Complete Data Analysis ({profilesData.length} profiles, {studentsCount} student records)
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {profilesData.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div>
                    <div className="font-medium">{profile.name}</div>
                    <div className="text-gray-600">{profile.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={profile.approval_status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                      {profile.approval_status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {profile.role_name || 'No Role'}
                    </Badge>
                    <Badge variant={profile.has_student_record ? 'default' : 'destructive'} className="text-xs">
                      {profile.has_student_record ? 'Has Record' : 'Missing Record'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
