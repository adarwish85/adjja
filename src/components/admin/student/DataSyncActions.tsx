
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, Users, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DataSyncActionsProps {
  onRefreshStudents?: () => void;
  onRefreshCoaches?: () => void;
}

export const DataSyncActions = ({ onRefreshStudents, onRefreshCoaches }: DataSyncActionsProps) => {
  const [loading, setLoading] = useState(false);
  const [syncResults, setSyncResults] = useState<{
    fixedStudents: number;
    totalChecked: number;
  } | null>(null);

  const handleDataConsistencyFix = async () => {
    setLoading(true);
    try {
      console.log("Starting data consistency fix...");
      
      // Step 1: Find students with Coach role but coach field not set to "Coach"
      const { data: coachRole, error: roleError } = await supabase
        .from("user_roles")
        .select("id")
        .eq("name", "Coach")
        .single();

      if (roleError || !coachRole) {
        throw new Error("Coach role not found");
      }

      // Step 2: Get students with auth accounts that have Coach role
      const { data: coachProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role_id", coachRole.id);

      if (profilesError) {
        throw profilesError;
      }

      const coachAuthIds = (coachProfiles || []).map(p => p.id);
      
      if (coachAuthIds.length === 0) {
        setSyncResults({ fixedStudents: 0, totalChecked: 0 });
        toast.success("No coach profiles found - data is consistent");
        return;
      }

      // Step 3: Find students with coach auth IDs but coach field not set properly
      const { data: studentsToFix, error: studentsError } = await supabase
        .from("students")
        .select("id, name, coach, auth_user_id")
        .in("auth_user_id", coachAuthIds)
        .neq("coach", "Coach");

      if (studentsError) {
        throw studentsError;
      }

      const totalChecked = coachAuthIds.length;
      const studentsNeedingFix = studentsToFix || [];

      console.log(`Found ${studentsNeedingFix.length} students needing coach field update`);

      // Step 4: Update the coach field for these students
      if (studentsNeedingFix.length > 0) {
        const { error: updateError } = await supabase
          .from("students")
          .update({ 
            coach: "Coach",
            updated_at: new Date().toISOString()
          })
          .in("id", studentsNeedingFix.map(s => s.id));

        if (updateError) {
          throw updateError;
        }

        console.log(`Successfully updated ${studentsNeedingFix.length} student records`);
      }

      setSyncResults({
        fixedStudents: studentsNeedingFix.length,
        totalChecked
      });

      if (studentsNeedingFix.length > 0) {
        toast.success(`Fixed ${studentsNeedingFix.length} student records`);
        // Trigger refreshes
        onRefreshStudents?.();
        onRefreshCoaches?.();
      } else {
        toast.success("All student-coach data is consistent");
      }

    } catch (error) {
      console.error("Error fixing data consistency:", error);
      toast.error("Failed to fix data consistency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Consistency Tools
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleDataConsistencyFix}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Fix Student-Coach Data
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              onRefreshStudents?.();
              onRefreshCoaches?.();
            }}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Refresh All Tables
          </Button>
        </div>

        {syncResults && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {syncResults.fixedStudents > 0 ? (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
              <span className="font-medium">Sync Results</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>Total coach profiles checked: <Badge variant="secondary">{syncResults.totalChecked}</Badge></div>
              <div>Students fixed: <Badge variant={syncResults.fixedStudents > 0 ? "destructive" : "secondary"}>{syncResults.fixedStudents}</Badge></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
