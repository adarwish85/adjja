
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  belt: string;
  stripes: number;
  coach: string;
  status: "active" | "inactive" | "on-hold";
  membershipType: "monthly" | "yearly" | "unlimited";
  attendanceRate: number;
  joinedDate: string;
  lastAttended: string;
}

interface AddStudentFormProps {
  student?: Student;
  onSubmit: (student: Student | Omit<Student, "id">) => void;
  isEditing?: boolean;
}

const branches = ["Downtown", "Westside", "North Valley", "South Side"];
const belts = ["White Belt", "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt"];
const coaches = ["Marcus Silva", "Ana Rodriguez", "David Chen", "Sarah Johnson"];
const membershipTypes = ["monthly", "yearly", "unlimited"];
const statusOptions = ["active", "inactive", "on-hold"];

export const AddStudentForm = ({ student, onSubmit, isEditing = false }: AddStudentFormProps) => {
  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    branch: student?.branch || "",
    belt: student?.belt || "",
    stripes: student?.stripes || 0,
    coach: student?.coach || "",
    status: student?.status || "active",
    membershipType: student?.membershipType || "monthly",
    attendanceRate: student?.attendanceRate || 0,
    joinedDate: student?.joinedDate || new Date().toISOString().split('T')[0],
    lastAttended: student?.lastAttended || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && student) {
      onSubmit({
        ...student,
        ...formData,
      });
    } else {
      onSubmit({
        ...formData,
        id: "",
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email address"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Select
            value={formData.branch}
            onValueChange={(value) => handleChange("branch", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="belt">Belt Level</Label>
          <Select
            value={formData.belt}
            onValueChange={(value) => handleChange("belt", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select belt" />
            </SelectTrigger>
            <SelectContent>
              {belts.map((belt) => (
                <SelectItem key={belt} value={belt}>
                  {belt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stripes">Stripes</Label>
          <Select
            value={formData.stripes.toString()}
            onValueChange={(value) => handleChange("stripes", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Stripes" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4].map((stripe) => (
                <SelectItem key={stripe} value={stripe.toString()}>
                  {stripe}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coach">Assigned Coach</Label>
          <Select
            value={formData.coach}
            onValueChange={(value) => handleChange("coach", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select coach" />
            </SelectTrigger>
            <SelectContent>
              {coaches.map((coach) => (
                <SelectItem key={coach} value={coach}>
                  {coach}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="membershipType">Membership Type</Label>
          <Select
            value={formData.membershipType}
            onValueChange={(value) => handleChange("membershipType", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select membership" />
            </SelectTrigger>
            <SelectContent>
              {membershipTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isEditing && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="attendanceRate">Attendance Rate (%)</Label>
            <Input
              id="attendanceRate"
              type="number"
              min="0"
              max="100"
              value={formData.attendanceRate}
              onChange={(e) => handleChange("attendanceRate", parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastAttended">Last Attended</Label>
            <Input
              id="lastAttended"
              type="date"
              value={formData.lastAttended}
              onChange={(e) => handleChange("lastAttended", e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="joinedDate">Join Date</Label>
        <Input
          id="joinedDate"
          type="date"
          value={formData.joinedDate}
          onChange={(e) => handleChange("joinedDate", e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" className="bg-bjj-gold hover:bg-bjj-gold-dark text-white">
          {isEditing ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>
  );
};
