
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

  // Helper: Checks if a given userId exists in auth.users
  const checkAuthUserExists = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    // Auth user exists if profile exists, since `profiles.id = auth.users.id` by design
    return Boolean(data && data.id === userId && !error);
  };

  const handleUpgrade = async () => {
    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < studentIds.length; i++) {
      const id = studentIds[i];
      const name = studentNames[i];

      // Check if the user exists in auth.users table (by checking existence in profiles)
      const hasAuthAccount = await checkAuthUserExists(id);

      if (!hasAuthAccount) {
        toast.error(
          `Cannot upgrade: ${name} does not have a registered Auth user account. Please create the account first.`
        );
        failCount += 1;
        continue;
      }

      // Supabase RPC only allows one at a time
      const { error } = await supabase.rpc("upgrade_user_to_coach", {
        p_user_id: id,
      });
      if (!error) {
        successCount += 1;
      } else {
        failCount += 1;
        // Show detailed error in toast
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
