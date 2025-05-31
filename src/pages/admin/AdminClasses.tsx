
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddClassForm } from "@/components/admin/AddClassForm";
import { 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  MapPin,
  Loader2 
} from "lucide-react";
import { useState } from "react";
import { useClasses, Class } from "@/hooks/useClasses";

const AdminClasses = () => {
  const { classes, loading, addClass, updateClass, deleteClass } = useClasses();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClasses = classes.length;
  const totalEnrolled = classes.reduce((sum, cls) => sum + cls.enrolled, 0);
  const totalCapacity = classes.reduce((sum, cls) => sum + cls.capacity, 0);
  const avgCapacity = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;
  const activeClasses = classes.filter(cls => cls.status === "Active").length;

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "Beginner": return "secondary";
      case "Advanced": return "destructive";
      case "Kids": return "outline";
      default: return "default";
    }
  };

  const handleAddClass = async (classData: Omit<Class, "id" | "created_at" | "updated_at">) => {
    try {
      await addClass(classData);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add class:", error);
    }
  };

  const handleEditClass = async (classData: Class) => {
    if (!editingClass) return;
    
    try {
      const { id, created_at, updated_at, ...updates } = classData;
      await updateClass(editingClass.id, updates);
      setIsEditDialogOpen(false);
      setEditingClass(null);
    } catch (error) {
      console.error("Failed to update class:", error);
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      await deleteClass(id);
    } catch (error) {
      console.error("Failed to delete class:", error);
    }
  };

  const openEditDialog = (classItem: Class) => {
    setEditingClass(classItem);
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-bjj-gold" />
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Classes Management</h1>
            <p className="text-bjj-gray mt-2">Manage your academy's class schedule and enrollment</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Class
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
              </DialogHeader>
              <AddClassForm 
                onSubmit={handleAddClass} 
                onClose={() => setIsAddDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Classes</CardTitle>
              <Calendar className="h-4 w-4 text-bjj-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{totalClasses}</div>
              <p className="text-xs text-bjj-gray">Active programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Enrolled</CardTitle>
              <Users className="h-4 w-4 text-bjj-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{totalEnrolled}</div>
              <p className="text-xs text-bjj-gray">Students in classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Capacity Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-bjj-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{avgCapacity}%</div>
              <p className="text-xs text-bjj-gray">Average utilization</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Active Classes</CardTitle>
              <Clock className="h-4 w-4 text-bjj-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{activeClasses}</div>
              <p className="text-xs text-bjj-gray">Currently running</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-bjj-navy">Classes Overview</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search classes..."
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
                  <TableHead>Class Name</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-medium text-bjj-navy">{cls.name}</TableCell>
                    <TableCell>{cls.instructor}</TableCell>
                    <TableCell className="text-sm">{cls.schedule}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-bjj-gray" />
                        {cls.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-bjj-gray" />
                        {cls.enrolled}/{cls.capacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLevelBadgeVariant(cls.level)}>
                        {cls.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-bjj-gray" />
                        {cls.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cls.status === "Active" ? "default" : "secondary"}>
                        {cls.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(cls)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Class</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{cls.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClass(cls.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredClasses.length === 0 && (
              <div className="text-center py-8 text-bjj-gray">
                {searchTerm ? "No classes found matching your search." : "No classes found."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Class</DialogTitle>
            </DialogHeader>
            {editingClass && (
              <AddClassForm 
                classItem={editingClass}
                onSubmit={handleEditClass} 
                onClose={() => {
                  setIsEditDialogOpen(false);
                  setEditingClass(null);
                }}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminClasses;
