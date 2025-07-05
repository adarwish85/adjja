
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AlertTriangle, UserPlus, RefreshCw } from "lucide-react";

interface MissingStudent {
  id: string;
  name: string;
  email: string;
  approval_status: string;
  role_name?: string;
  has_student_record: boolean;
}

export const MissingStudentSync = () => {
  const [missingStudents, setMissingStudents] = useState<MissingStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState<string | null>(null);

  const checkMissingStudents = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Checking for missing student records...');
      
      // Get all approved profiles with Student role
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
        `)
        .eq('approval_status', 'approved');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Approved profiles:', profiles);

      // Get all existing student records
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('auth_user_id');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        throw studentsError;
      }

      console.log('Existing student records:', students);

      const existingStudentIds = new Set(students?.map(s => s.auth_user_id) || []);
      
      // Find profiles that should have student records but don't
      const missing = profiles?.filter(profile => {
        const isStudent = profile.user_roles?.name === 'Student';
        const hasStudentRecord = existingStudentIds.has(profile.id);
        return isStudent && !hasStudentRecord;
      }).map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        approval_status: profile.approval_status,
        role_name: profile.user_roles?.name,
        has_student_record: false
      })) || [];

      console.log('Missing student records:', missing);
      setMissingStudents(missing);
      
      if (missing.length === 0) {
        toast.success("All approved students have records");
      } else {
        toast.warning(`Found ${missing.length} missing student record(s)`);
      }
      
    } catch (error) {
      console.error('Error checking missing students:', error);
      toast.error("Failed to check missing students");
    } finally {
      setIsLoading(false);
    }
  };

  const createStudentRecord = async (profileId: string, name: string, email: string) => {
    try {
      setIsCreating(profileId);
      console.log('Creating student record for:', { profileId, name, email });
      
      // Use the existing approval function to create student record
      const { data, error } = await supabase.rpc('create_student_after_approval', {
        p_user_id: profileId
      });

      if (error) {
        console.error('Error creating student record:', error);
        throw error;
      }

      console.log('Student record created successfully:', data);
      toast.success(`Student record created for ${name}`);
      
      // Refresh the missing students list
      await checkMissingStudents();
      
    } catch (error) {
      console.error('Error creating student record:', error);
      toast.error(`Failed to create student record for ${name}`);
    } finally {
      setIsCreating(null);
    }
  };

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Missing Student Records Sync
        </CardTitle>
        <p className="text-sm text-yellow-700">
          Check for approved users who are missing student records
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={checkMissingStudents}
          disabled={isLoading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Check Missing Records
        </Button>

        {missingStudents.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-yellow-800">
              Found {missingStudents.length} missing student record(s):
            </h4>
            {missingStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded border">
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-600">{student.email}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{student.role_name}</Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {student.approval_status}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => createStudentRecord(student.id, student.name, student.email)}
                  disabled={isCreating === student.id}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isCreating === student.id ? 'Creating...' : 'Create Record'}
                </Button>
              </div>
            ))}
          </div>
        )}

        {missingStudents.length === 0 && !isLoading && (
          <div className="text-center py-4 text-green-700">
            ✅ All approved students have proper records
          </div>
        )}
      </CardContent>
    </Card>
  );
};
