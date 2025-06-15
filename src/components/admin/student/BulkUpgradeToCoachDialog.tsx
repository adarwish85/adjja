
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

  const handleUpgrade = async () => {
    setLoading(true);
    let successCount = 0;
    let failCount = 0;
    for (const id of studentIds) {
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
          `Failed to upgrade: ${studentNames[studentIds.indexOf(id)]}${
            error && error.message ? ` (${error.message})` : ""
          }`
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
