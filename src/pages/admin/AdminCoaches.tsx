
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react";
import { AddCoachForm } from "@/components/admin/AddCoachForm";

interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  belt: string;
  specialties: string[];
  status: "active" | "inactive";
  studentsCount: number;
  joinedDate: string;
}

const mockCoaches: Coach[] = [
  {
    id: "1",
    name: "Marcus Silva",
    email: "marcus@adjja.com",
    phone: "+1 (555) 123-4567",
    branch: "Downtown",
    belt: "Black Belt",
    specialties: ["Competition", "No-Gi"],
    status: "active",
    studentsCount: 45,
    joinedDate: "2020-03-15",
  },
  {
    id: "2",
    name: "Ana Rodriguez",
    email: "ana@adjja.com",
    phone: "+1 (555) 987-6543",
    branch: "Westside",
    belt: "Brown Belt",
    specialties: ["Fundamentals", "Women's Classes"],
    status: "active",
    studentsCount: 32,
    joinedDate: "2021-08-22",
  },
  {
    id: "3",
    name: "David Chen",
    email: "david@adjja.com",
    phone: "+1 (555) 456-7890",
    branch: "North Valley",
    belt: "Purple Belt",
    specialties: ["Kids Classes", "Self Defense"],
    status: "active",
    studentsCount: 28,
    joinedDate: "2022-01-10",
  },
];

const AdminCoaches = () => {
  const [coaches, setCoaches] = useState<Coach[]>(mockCoaches);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCoach = (newCoach: Omit<Coach, "id">) => {
    const coach: Coach = {
      ...newCoach,
      id: Date.now().toString(),
    };
    setCoaches([...coaches, coach]);
    setIsAddDialogOpen(false);
  };

  const handleEditCoach = (updatedCoach: Coach) => {
    setCoaches(coaches.map(coach => 
      coach.id === updatedCoach.id ? updatedCoach : coach
    ));
    setEditingCoach(null);
  };

  const handleDeleteCoach = (coachId: string) => {
    setCoaches(coaches.filter(coach => coach.id !== coachId));
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

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Coaches</h1>
            <p className="text-bjj-gray">Manage academy coaches and instructors</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Coach
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Coach</DialogTitle>
                <DialogDescription>
                  Enter the coach's information to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <AddCoachForm onSubmit={handleAddCoach} />
            </DialogContent>
          </Dialog>
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
              <div className="text-2xl font-bold text-bjj-navy">
                {coaches.filter(c => c.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">
                {coaches.reduce((sum, coach) => sum + coach.studentsCount, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">
                {new Set(coaches.map(c => c.branch)).size}
              </div>
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
                  <TableHead>Branch</TableHead>
                  <TableHead>Belt</TableHead>
                  <TableHead>Specialties</TableHead>
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
                          Joined {new Date(coach.joinedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-bjj-gray" />
                          {coach.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-bjj-gray" />
                          {coach.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{coach.branch}</Badge>
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
                      <div className="font-medium">{coach.studentsCount}</div>
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
                          onClick={() => handleDeleteCoach(coach.id)}
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Coach</DialogTitle>
              <DialogDescription>
                Update the coach's information.
              </DialogDescription>
            </DialogHeader>
            {editingCoach && (
              <AddCoachForm 
                coach={editingCoach} 
                onSubmit={handleEditCoach}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  );
};

export default AdminCoaches;
