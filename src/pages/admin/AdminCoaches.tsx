import { useState } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Loader2, RefreshCw, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MultiStepCoachForm } from "@/components/admin/coach/MultiStepCoachForm";
import { EmptyCoachesState } from "@/components/admin/coach/EmptyCoachesState";
import { CoachesTable } from "@/components/admin/coach/CoachesTable";
import { BulkCoachActionsDropdown } from "@/components/admin/coach/BulkCoachActionsDropdown";
import { CoachNotificationModal } from "@/components/admin/coach/CoachNotificationModal";
import { CoachClassAssignmentModal } from "@/components/admin/coach/CoachClassAssignmentModal";
import { useCoaches } from "@/hooks/useCoaches";
import { Coach } from "@/types/coach";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminCoaches = () => {
  const { coaches, loading, error, addCoach, updateCoach, deleteCoach, refetch, forceRefresh, recalculateAllCoachStudentCounts, syncAllCoachClassAssignments } = useCoaches();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [deletingCoach, setDeletingCoach] = useState<Coach | null>(null);
  
  // Bulk selection state
  const [selectedCoachIds, setSelectedCoachIds] = useState<string[]>([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isClassAssignmentModalOpen, setIsClassAssignmentModalOpen] = useState(false);
  const [isStatusToggleDialogOpen, setIsStatusToggleDialogOpen] = useState(false);
  const [isRemoveRoleDialogOpen, setIsRemoveRoleDialogOpen] = useState(false);

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCoaches = coaches.filter(coach => selectedCoachIds.includes(coach.id));

  // Bulk selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCoachIds(filteredCoaches.map(coach => coach.id));
    } else {
      setSelectedCoachIds([]);
    }
  };

  const handleSelectCoach = (coachId: string, checked: boolean) => {
    if (checked) {
      setSelectedCoachIds(prev => [...prev, coachId]);
    } else {
      setSelectedCoachIds(prev => prev.filter(id => id !== coachId));
    }
  };

  const handleClearSelection = () => {
    setSelectedCoachIds([]);
  };

  // Bulk action handlers
  const handleSendNotification = async (title: string, message: string) => {
    for (const coach of selectedCoaches) {
      if (coach.is_upgraded_student && coach.auth_user_id) {
        await supabase
          .from("notifications")
          .insert({
            user_id: coach.auth_user_id,
            title,
            message,
            type: "announcement"
          });
      }
    }
  };

  const handleAssignClasses = async (classIds: string[]) => {
    // Get class names for assignment
    const { data: classes } = await supabase
      .from("classes")
      .select("name")
      .in("id", classIds);

    const classNames = classes?.map(c => c.name) || [];

    for (const coach of selectedCoaches) {
      const currentClasses = coach.assigned_classes || [];
      const newClasses = [...new Set([...currentClasses, ...classNames])];
      
      await updateCoach(coach.id, { assigned_classes: newClasses });
    }
  };

  const handleToggleStatus = async () => {
    const activeCoaches = selectedCoaches.filter(c => c.status === "active");
    const inactiveCoaches = selectedCoaches.filter(c => c.status === "inactive");
    
    // Toggle status for each coach
    for (const coach of selectedCoaches) {
      const newStatus = coach.status === "active" ? "inactive" : "active";
      await updateCoach(coach.id, { status: newStatus });
    }
    
    toast.success(`Status updated for ${selectedCoaches.length} coach${selectedCoaches.length > 1 ? 'es' : ''}`);
    setSelectedCoachIds([]);
    setIsStatusToggleDialogOpen(false);
  };

  const handleRemoveCoachRole = async () => {
    let successCount = 0;
    
    for (const coach of selectedCoaches) {
      if (coach.is_upgraded_student && coach.auth_user_id) {
        try {
          const { error } = await supabase.rpc('downgrade_coach_to_student', {
            p_user_id: coach.auth_user_id
          });
          
          if (!error) {
            successCount++;
          }
        } catch (error) {
          console.error(`Failed to downgrade coach ${coach.name}:`, error);
        }
      }
    }
    
    if (successCount > 0) {
      toast.success(`Successfully downgraded ${successCount} coach${successCount > 1 ? 'es' : ''} to student${successCount > 1 ? 's' : ''}`);
      refetch();
    }
    
    setSelectedCoachIds([]);
    setIsRemoveRoleDialogOpen(false);
  };

  const handleAddCoach = async (newCoach: Omit<Coach, "id" | "created_at" | "updated_at">) => {
    try {
      await addCoach(newCoach);
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleEditCoach = async (updatedCoachData: Omit<Coach, "id" | "created_at" | "updated_at">) => {
    if (!editingCoach) {
      console.error("AdminCoaches: No coach selected for editing");
      return;
    }

    try {
      console.log("AdminCoaches: Editing coach with ID:", editingCoach.id);
      console.log("AdminCoaches: Updated coach data:", updatedCoachData);
      
      // Use the stored editingCoach.id for the update
      await updateCoach(editingCoach.id, updatedCoachData);
      setEditingCoach(null);
    } catch (error) {
      console.error("AdminCoaches: Error updating coach:", error);
      // Error is already handled in the hook
    }
  };

  const handleDeleteCoach = async () => {
    if (deletingCoach) {
      try {
        await deleteCoach(deletingCoach.id);
        setDeletingCoach(null);
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  };

  const handleRecalculateStudentCounts = async () => {
    await recalculateAllCoachStudentCounts();
  };

  const handleSyncClassAssignments = async () => {
    await syncAllCoachClassAssignments();
  };

  const handleRetry = () => {
    refetch();
  };

  const handleForceRefresh = () => {
    console.log("AdminCoaches: Force refresh triggered");
    forceRefresh();
  };

  const getBeltColor = (belt: string) => {
    switch (belt.toLowerCase()) {
      case "black belt":
        return "bg-black text-white";
      case "brown belt":
        return "bg-yellow-800 text-white";
      case "purple belt":
        return "bg-purple-600 text-white";
      case "blue belt":
        return "bg-blue-600 text-white";
      case "white belt":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const activeCoaches = coaches.filter(c => c.status === "active");
  const totalStudents = coaches.reduce((sum, coach) => sum + coach.students_count, 0);
  const totalClasses = coaches.reduce((sum, coach) => sum + (coach.assigned_classes?.length || 0), 0);

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-bjj-gold" />
            <span className="ml-2 text-bjj-gray">Loading coaches...</span>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  // Show empty state if no coaches or error
  if (error || coaches.length === 0) {
    return (
      <SuperAdminLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-bjj-navy">Coaches</h1>
              <p className="text-bjj-gray">Manage academy coaches and instructors</p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="text-bjj-navy border-bjj-navy hover:bg-bjj-navy hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>

              <Button 
                variant="outline" 
                onClick={handleForceRefresh}
                className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Force Refresh
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coach
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Coach</DialogTitle>
                    <DialogDescription>
                      Enter the coach's information using the multi-step wizard.
                    </DialogDescription>
                  </DialogHeader>
                  <MultiStepCoachForm onSubmit={handleAddCoach} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <EmptyCoachesState 
            hasError={!!error}
            errorMessage={error}
            onRetry={handleRetry}
            onAddCoach={() => setIsAddDialogOpen(true)}
          />
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Coaches</h1>
            <p className="text-bjj-gray">Manage academy coaches and instructors</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRecalculateStudentCounts}
              className="text-bjj-navy border-bjj-navy hover:bg-bjj-navy hover:text-white"
            >
              Refresh Student Counts
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleSyncClassAssignments}
              className="text-bjj-navy border-bjj-navy hover:bg-bjj-navy hover:text-white"
            >
              Sync Class Assignments
            </Button>

            <Button 
              variant="outline" 
              onClick={handleForceRefresh}
              className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Force Refresh
            </Button>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Coach
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Coach</DialogTitle>
                  <DialogDescription>
                    Enter the coach's information using the multi-step wizard.
                  </DialogDescription>
                </DialogHeader>
                <MultiStepCoachForm onSubmit={handleAddCoach} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Coaches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{coaches.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Active Coaches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{activeCoaches.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Assigned Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{totalClasses}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Coaches</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search coaches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Bulk Actions */}
            <BulkCoachActionsDropdown
              selected={selectedCoachIds.length}
              onSendNotificationClick={() => setIsNotificationModalOpen(true)}
              onAssignClassClick={() => setIsClassAssignmentModalOpen(true)}
              onToggleStatusClick={() => setIsStatusToggleDialogOpen(true)}
              onRemoveCoachRoleClick={() => setIsRemoveRoleDialogOpen(true)}
              onClearSelection={handleClearSelection}
            />

            {/* Coaches Table */}
            <CoachesTable
              coaches={filteredCoaches}
              selectedCoachIds={selectedCoachIds}
              onSelectAll={handleSelectAll}
              onSelectCoach={handleSelectCoach}
              onEditCoach={setEditingCoach}
              onDeleteCoach={setDeletingCoach}
              getBeltColor={getBeltColor}
            />
          </CardContent>
        </Card>

        {/* Edit Coach Dialog */}
        <Dialog open={!!editingCoach} onOpenChange={(open) => !open && setEditingCoach(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Coach</DialogTitle>
              <DialogDescription>
                Update the coach's information using the multi-step wizard.
              </DialogDescription>
            </DialogHeader>
            {editingCoach && (
              <MultiStepCoachForm 
                coach={editingCoach} 
                onSubmit={handleEditCoach}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingCoach} onOpenChange={(open) => !open && setDeletingCoach(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the coach
                "{deletingCoach?.name}" from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteCoach}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Action Modals */}
        <CoachNotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
          selectedCoaches={selectedCoaches}
          onSend={handleSendNotification}
        />

        <CoachClassAssignmentModal
          isOpen={isClassAssignmentModalOpen}
          onClose={() => setIsClassAssignmentModalOpen(false)}
          selectedCoaches={selectedCoaches}
          onAssign={handleAssignClasses}
        />

        {/* Status Toggle Confirmation */}
        <AlertDialog open={isStatusToggleDialogOpen} onOpenChange={setIsStatusToggleDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Toggle Coach Status</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to toggle the status for {selectedCoaches.length} selected coach{selectedCoaches.length > 1 ? 'es' : ''}?
                This will activate inactive coaches and deactivate active coaches.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleStatus}>
                Toggle Status
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Remove Coach Role Confirmation */}
        <AlertDialog open={isRemoveRoleDialogOpen} onOpenChange={setIsRemoveRoleDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Coach Role</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove the coach role from {selectedCoaches.length} selected coach{selectedCoaches.length > 1 ? 'es' : ''}?
                This will downgrade them back to student status.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemoveCoachRole} className="bg-red-600 hover:bg-red-700">
                Remove Coach Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminCoaches;
