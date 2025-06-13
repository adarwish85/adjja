import { useState } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Mail, Phone, Loader2 } from "lucide-react";
import { MultiStepCoachForm } from "@/components/admin/coach/MultiStepCoachForm";
import { useCoaches } from "@/hooks/useCoaches";
import { Coach } from "@/types/coach";
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

const AdminCoaches = () => {
  const { coaches, loading, addCoach, updateCoach, deleteCoach, recalculateAllCoachStudentCounts, syncAllCoachClassAssignments } = useCoaches();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [deletingCoach, setDeletingCoach] = useState<Coach | null>(null);

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Coach</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Belt</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Assigned Classes</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoaches.map((coach) => (
                  <TableRow key={coach.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-bjj-navy">{coach.name}</div>
                        <div className="text-sm text-bjj-gray">
                          Joined {new Date(coach.joined_date).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-bjj-gray" />
                          {coach.email}
                        </div>
                        {coach.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1 text-bjj-gray" />
                            {coach.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getBeltColor(coach.belt)}>
                        {coach.belt}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {coach.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {coach.assigned_classes?.map((className) => (
                          <Badge key={className} variant="outline" className="text-xs">
                            {className}
                          </Badge>
                        )) || <span className="text-gray-500 text-sm">None</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{coach.students_count}</div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={coach.status === "active" ? "default" : "secondary"}
                        className={coach.status === "active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {coach.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCoach(coach)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingCoach(coach)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
      </div>
    </SuperAdminLayout>
  );
};

export default AdminCoaches;
