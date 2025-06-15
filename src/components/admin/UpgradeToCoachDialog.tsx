
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UpgradeToCoachDialogProps {
  onSuccess?: () => void;
}

export const UpgradeToCoachDialog = ({ onSuccess }: UpgradeToCoachDialogProps) => {
  const { users, refetch } = useUsers();
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Filter for students only
  const students = users.filter(user => user.role.toLowerCase() === 'student');

  const handleUpgrade = async () => {
    if (!selectedUser) {
      toast.error("Please select a student to upgrade");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.rpc('upgrade_user_to_coach', {
        p_user_id: selectedUser
      });

      if (error) throw error;

      toast.success("Student successfully upgraded to Coach");
      setSelectedUser("");
      setIsOpen(false);
      await refetch();
      onSuccess?.();
    } catch (error: any) {
      console.error('Error upgrading to coach:', error);
      toast.error(error.message || "Failed to upgrade student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-bjj-navy">
          <UserPlus className="h-4 w-4 mr-2" />
          Upgrade to Coach
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Upgrade Student to Coach
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Student</label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose student to upgrade..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{student.name}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge variant="outline">Student</Badge>
                        <span className="text-xs text-gray-500">{student.email}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The upgraded user will maintain their student profile and capabilities 
              while gaining access to coach-only features. They will appear in both student and coach lists.
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleUpgrade} 
              disabled={!selectedUser || loading}
              className="flex-1"
            >
              {loading ? "Upgrading..." : "Upgrade to Coach"}
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
