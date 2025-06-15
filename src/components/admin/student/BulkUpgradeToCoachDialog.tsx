import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  useCheckAuthUserByEmail,
  useCheckAuthUserById,
  useProfileIdByEmail,
} from "@/hooks/student-auth";

interface BulkUpgradeToCoachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentIds: string[];
  studentNames: string[];
  onSuccess?: () => void;
}

export const BulkUpgradeToCoachDialog = ({
  open,
  onOpenChange,
  studentIds,
  studentNames,
  onSuccess,
}: BulkUpgradeToCoachDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { getProfileIdByEmail } = useProfileIdByEmail();
  const { checkAuthUserById } = useCheckAuthUserById();
  const [failed, setFailed] = useState<{ name: string; msg: string }[]>([]);

  // You must provide emails for this mapping
  // New: We'll ask the parent to pass email mapping, but for now, we fetch all needed emails!
  // We'll fetch students rows by the studentIds.
  const fetchStudentsForIds = async (ids: string[]) => {
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from("students")
      .select("id,email")
      .in("id", ids);
    if (error) return [];
    return data || [];
  };

  const handleUpgrade = async () => {
    setLoading(true);
    setFailed([]);
    let successCount = 0;
    let failCount = 0;

    // STEP 1: Map studentIds to profile IDs via email

    // Fetch emails for selected studentIds
    const studentsRecords = await fetchStudentsForIds(studentIds);

    // Map from studentId to email for fast lookup
    const studentInfoMap: Record<string, { email: string, name: string }> = {};
    (studentsRecords || []).forEach((student, i) => {
      studentInfoMap[student.id] = { email: student.email, name: studentNames[i] };
    });

    // Now loop and for each, use getProfileIdByEmail
    for (let i = 0; i < studentIds.length; i++) {
      const studentId = studentIds[i];
      const { email, name } = studentInfoMap[studentId] || {};

      if (!email) {
        toast.error(`No email found for student: ${name || "Unknown"}`);
        failCount += 1;
        continue;
      }

      // Get Auth Profile ID for this email
      const profileId = await getProfileIdByEmail(email);
      if (!profileId) {
        toast.error(
          `Cannot upgrade: ${name} does not have a registered Auth user account. Please create the account first.`
        );
        failCount += 1;
        continue;
      }

      // Double-check that the profile exists in Auth
      const hasAuthAccount = await checkAuthUserById(profileId);

      if (!hasAuthAccount) {
        toast.error(
          `Cannot upgrade: ${name} does not have a valid Auth user account. Please create the account first.`
        );
        failCount += 1;
        continue;
      }

      // Supabase RPC only allows one at a time
      const { error } = await supabase.rpc("upgrade_user_to_coach", {
        p_user_id: profileId,
      });
      if (!error) {
        successCount += 1;
      } else {
        failCount += 1;
        toast.error(
          `Failed to upgrade: ${name}${error && error.message ? ` (${error.message})` : ""}`
        );
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} student${successCount > 1 ? "s" : ""} upgraded to Coach`);
      onSuccess?.();
    }
    if (failCount === 0) {
      onOpenChange(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Coach</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            Are you sure you want to upgrade the following {studentIds.length} student{studentIds.length > 1 ? "s" : ""} to Coach?
          </p>
          <ul className="p-3 space-y-1">
            {studentNames.map(name => (
              <li key={name} className="list-disc ml-4">{name}</li>
            ))}
          </ul>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleUpgrade} disabled={loading} className="flex-1">
              {loading ? "Upgrading..." : "Confirm Upgrade"}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
