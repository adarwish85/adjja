
import { useState, useEffect } from "react";
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
import { Student } from "@/hooks/useStudents";
import { useCoaches } from "@/hooks/useCoaches";

interface AddStudentFormProps {
  student?: Student;
  onSubmit: (student: Student | Omit<Student, "id" | "created_at" | "updated_at">) => void;
  isEditing?: boolean;
}

const branches = ["Downtown", "Westside", "North Valley", "South Side"];
const belts = ["White Belt", "Blue Belt", "Purple Belt", "Brown Belt", "Black Belt"];
const membershipTypes = ["monthly", "yearly", "unlimited"];
const statusOptions = ["active", "inactive", "on-hold"];

export const AddStudentForm = ({ student, onSubmit, isEditing = false }: AddStudentFormProps) => {
  const { coaches, loading: coachesLoading } = useCoaches();
  const [formData, setFormData] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    branch: student?.branch || "",
    belt: student?.belt || "",
    stripes: student?.stripes || 0,
    coach: student?.coach || "",
    status: student?.status || "active" as const,
    membership_type: student?.membership_type || "monthly" as const,
    attendance_rate: student?.attendance_rate || 0,
    joined_date: student?.joined_date || new Date().toISOString().split('T')[0],
    last_attended: student?.last_attended || new Date().toISOString().split('T')[0],
    // New fields for account creation
    username: "",
    password: "",
    createAccount: !isEditing, // Only show for new students
  });

  // Get active coaches for the dropdown
  const activeCoaches = coaches.filter(coach => coach.status === "active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission data:", formData);
    
    if (isEditing && student) {
      onSubmit({
        ...student,
        ...formData,
      });
    } else {
      // Create the student object with proper typing
      const newStudent: Omit<Student, "id" | "created_at" | "updated_at"> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        branch: formData.branch,
        belt: formData.belt,
        stripes: formData.stripes,
        coach: formData.coach,
        status: formData.status,
        membership_type: formData.membership_type,
        attendance_rate: formData.attendance_rate,
        joined_date: formData.joined_date,
        last_attended: formData.last_attended || null,
        // Add account creation data
        username: formData.createAccount ? formData.username : undefined,
        password: formData.createAccount ? formData.password : undefined,
        createAccount: formData.createAccount,
      };
      
      console.log("Submitting new student:", newStudent);
      onSubmit(newStudent);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
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

      {/* Account Creation Section - Only for new students */}
      {!isEditing && (
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="createAccount"
              checked={formData.createAccount}
              onChange={(e) => handleChange("createAccount", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="createAccount" className="text-sm font-medium">
              Create student portal account
            </Label>
          </div>
          
          {formData.createAccount && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Enter username"
                  required={formData.createAccount}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Enter password"
                  required={formData.createAccount}
                />
              </div>
            </div>
          )}
        </div>
      )}

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
            disabled={coachesLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={coachesLoading ? "Loading coaches..." : "Select coach"} />
            </SelectTrigger>
            <SelectContent>
              {activeCoaches.map((coach) => (
                <SelectItem key={coach.id} value={coach.name}>
                  {coach.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="membership_type">Membership Type</Label>
          <Select
            value={formData.membership_type}
            onValueChange={(value) => handleChange("membership_type", value)}
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
            <Label htmlFor="attendance_rate">Attendance Rate (%)</Label>
            <Input
              id="attendance_rate"
              type="number"
              min="0"
              max="100"
              value={formData.attendance_rate}
              onChange={(e) => handleChange("attendance_rate", parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_attended">Last Attended</Label>
            <Input
              id="last_attended"
              type="date"
              value={formData.last_attended}
              onChange={(e) => handleChange("last_attended", e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="joined_date">Join Date</Label>
        <Input
          id="joined_date"
          type="date"
          value={formData.joined_date}
          onChange={(e) => handleChange("joined_date", e.target.value)}
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
