
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
  MapPin 
} from "lucide-react";
import { useState } from "react";

const mockClasses = [
  {
    id: 1,
    name: "Morning Fundamentals",
    instructor: "Professor Silva",
    schedule: "Mon, Wed, Fri - 6:00 AM",
    duration: "60 min",
    capacity: 20,
    enrolled: 15,
    level: "Beginner",
    location: "Mat 1",
    status: "Active"
  },
  {
    id: 2,
    name: "Competition Team",
    instructor: "Coach Martinez",
    schedule: "Tue, Thu - 7:00 PM",
    duration: "90 min",
    capacity: 15,
    enrolled: 12,
    level: "Advanced",
    location: "Mat 2",
    status: "Active"
  },
  {
    id: 3,
    name: "Kids BJJ",
    instructor: "Coach Anderson",
    schedule: "Mon, Wed, Fri - 4:00 PM",
    duration: "45 min",
    capacity: 12,
    enrolled: 8,
    level: "Kids",
    location: "Mat 1",
    status: "Active"
  },
  {
    id: 4,
    name: "Open Mat",
    instructor: "Various",
    schedule: "Saturday - 10:00 AM",
    duration: "120 min",
    capacity: 25,
    enrolled: 18,
    level: "All Levels",
    location: "Both Mats",
    status: "Active"
  },
  {
    id: 5,
    name: "Women's Only",
    instructor: "Coach Johnson",
    schedule: "Thursday - 6:00 PM",
    duration: "60 min",
    capacity: 15,
    enrolled: 9,
    level: "All Levels",
    location: "Mat 2",
    status: "Active"
  }
];

const AdminClasses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredClasses = mockClasses.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClasses = mockClasses.length;
  const totalEnrolled = mockClasses.reduce((sum, cls) => sum + cls.enrolled, 0);
  const avgCapacity = Math.round((totalEnrolled / mockClasses.reduce((sum, cls) => sum + cls.capacity, 0)) * 100);
  const activeClasses = mockClasses.filter(cls => cls.status === "Active").length;

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "Beginner": return "secondary";
      case "Advanced": return "destructive";
      case "Kids": return "outline";
      default: return "default";
    }
  };

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
              <AddClassForm onClose={() => setIsAddDialogOpen(false)} />
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
                        {cls.duration}
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
                        <Button variant="ghost" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
      </div>
    </SuperAdminLayout>
  );
};

export default AdminClasses;
