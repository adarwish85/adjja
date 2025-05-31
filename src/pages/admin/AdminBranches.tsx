
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
import { AddBranchForm } from "@/components/admin/AddBranchForm";
import { 
  Building, 
  MapPin, 
  Phone, 
  Users, 
  TrendingUp, 
  Plus, 
  Search, 
  Edit2, 
  Trash2 
} from "lucide-react";
import { useState } from "react";

const mockBranches = [
  {
    id: 1,
    name: "Downtown Academy",
    address: "123 Main St, Downtown",
    city: "Los Angeles",
    phone: "(555) 123-4567",
    totalStudents: 150,
    activeClasses: 12,
    status: "Active"
  },
  {
    id: 2,
    name: "Westside Branch",
    address: "456 Ocean Ave, Westside",
    city: "Los Angeles",
    phone: "(555) 987-6543",
    totalStudents: 85,
    activeClasses: 8,
    status: "Active"
  },
  {
    id: 3,
    name: "Valley Training Center",
    address: "789 Valley Blvd, Valley",
    city: "Los Angeles", 
    phone: "(555) 456-7890",
    totalStudents: 120,
    activeClasses: 10,
    status: "Active"
  },
  {
    id: 4,
    name: "Eastside Dojo",
    address: "321 East St, Eastside",
    city: "Los Angeles",
    phone: "(555) 234-5678",
    totalStudents: 95,
    activeClasses: 7,
    status: "Maintenance"
  }
];

const AdminBranches = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredBranches = mockBranches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBranches = mockBranches.length;
  const totalStudents = mockBranches.reduce((sum, branch) => sum + branch.totalStudents, 0);
  const totalClasses = mockBranches.reduce((sum, branch) => sum + branch.activeClasses, 0);
  const activeBranches = mockBranches.filter(branch => branch.status === "Active").length;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "Maintenance": return "secondary";
      case "Closed": return "destructive";
      default: return "outline";
    }
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-bjj-navy">Branches Management</h1>
            <p className="text-bjj-gray mt-2">Manage your academy locations and facilities</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
              </DialogHeader>
              <AddBranchForm onClose={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Branches</CardTitle>
              <Building className="h-4 w-4 text-bjj-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{totalBranches}</div>
              <p className="text-xs text-bjj-gray">Locations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Students</CardTitle>
              <Users className="h-4 w-4 text-bjj-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{totalStudents}</div>
              <p className="text-xs text-bjj-gray">Across all branches</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Total Classes</CardTitle>
              <TrendingUp className="h-4 w-4 text-bjj-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{totalClasses}</div>
              <p className="text-xs text-bjj-gray">Active programs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-bjj-gray">Active Branches</CardTitle>
              <Building className="h-4 w-4 text-bjj-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-bjj-navy">{activeBranches}</div>
              <p className="text-xs text-bjj-gray">Currently operating</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-bjj-navy">Branches Overview</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search branches..."
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
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell className="font-medium text-bjj-navy">{branch.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-bjj-gray" />
                        <div>
                          <div className="text-sm">{branch.address}</div>
                          <div className="text-xs text-bjj-gray">{branch.city}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1 text-bjj-gray" />
                          {branch.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-bjj-gray" />
                        {branch.totalStudents}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1 text-bjj-gray" />
                        {branch.activeClasses}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(branch.status)}>
                        {branch.status}
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

export default AdminBranches;
