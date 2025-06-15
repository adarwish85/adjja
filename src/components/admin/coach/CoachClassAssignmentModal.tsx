
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Coach } from "@/types/coach";

interface CoachClassAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoaches: Coach[];
  onAssign: (classIds: string[]) => Promise<void>;
}

interface Class {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
}

export const CoachClassAssignmentModal: React.FC<CoachClassAssignmentModalProps> = ({
  isOpen,
  onClose,
  selectedCoaches,
  onAssign,
}) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("classes")
        .select("id, name, instructor, schedule")
        .eq("status", "Active")
        .order("name");

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  const handleClassToggle = (classId: string, checked: boolean) => {
    if (checked) {
      setSelectedClassIds(prev => [...prev, classId]);
    } else {
      setSelectedClassIds(prev => prev.filter(id => id !== classId));
    }
  };

  const handleAssign = async () => {
    if (selectedClassIds.length === 0) {
      toast.error("Please select at least one class");
      return;
    }

    setAssigning(true);
    try {
      await onAssign(selectedClassIds);
      toast.success(`Classes assigned to ${selectedCoaches.length} coach${selectedCoaches.length > 1 ? 'es' : ''}`);
      setSelectedClassIds([]);
      onClose();
    } catch (error) {
      toast.error("Failed to assign classes");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Classes to Coaches</DialogTitle>
          <DialogDescription>
            Assign classes to {selectedCoaches.length} selected coach{selectedCoaches.length > 1 ? 'es' : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading classes...</div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {classes.map((classItem) => (
                <div key={classItem.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={classItem.id}
                    checked={selectedClassIds.includes(classItem.id)}
                    onCheckedChange={(checked) => handleClassToggle(classItem.id, checked as boolean)}
                  />
                  <Label htmlFor={classItem.id} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{classItem.name}</div>
                      <div className="text-sm text-gray-500">
                        {classItem.schedule} • {classItem.instructor}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
              {classes.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No active classes found
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={assigning}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={assigning || selectedClassIds.length === 0}>
              {assigning ? "Assigning..." : "Assign Classes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
