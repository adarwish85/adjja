
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useImprovedStudentUpgrade } from "@/hooks/useImprovedStudentUpgrade";

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
  const [upgradeResults, setUpgradeResults] = useState<any[]>([]);
  const { bulkUpgradeStudentsToCoach, loading } = useImprovedStudentUpgrade();

  const handleUpgrade = async () => {
    try {
      const { successful, failed, results } = await bulkUpgradeStudentsToCoach(studentIds);
      setUpgradeResults(results);
      
      if (successful > 0) {
        onSuccess?.();
      }
      
      // Only close if all succeeded
      if (failed === 0) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Bulk upgrade failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upgrade to Coach</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p>
            Are you sure you want to upgrade the following {studentIds.length} student{studentIds.length > 1 ? "s" : ""} to Coach?
          </p>
          
          <ul className="p-3 space-y-1 bg-gray-50 rounded-md max-h-40 overflow-y-auto">
            {studentNames.map((name, index) => (
              <li key={index} className="list-disc ml-4">{name}</li>
            ))}
          </ul>

          {/* Show results if any */}
          {upgradeResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Upgrade Results:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {upgradeResults.map((result, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded ${
                      result.success
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {result.success
                      ? `✓ ${result.student_name || studentNames[index]} upgraded successfully`
                      : `✗ ${result.student_name || studentNames[index]}: ${result.error}`
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <Button 
              onClick={handleUpgrade} 
              disabled={loading} 
              className="flex-1"
            >
              {loading ? "Upgrading..." : "Confirm Upgrade"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
