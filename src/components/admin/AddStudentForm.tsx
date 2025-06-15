import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Student } from "@/hooks/useStudents";
import { useCoaches } from "@/hooks/useCoaches";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useAuthUserDetection } from "@/hooks/useAuthUserDetection";

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
  const { activeSubscriptionPlans, isLoading: plansLoading } = useSubscriptionPlans();
  const { checkAuthUserByEmail, checking } = useAuthUserDetection();
  const [hasAuthUser, setHasAuthUser] = useState(false);
  
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
    subscription_plan_id: student?.subscription_plan_id || "",
    plan_start_date: student?.plan_start_date || new Date().toISOString().split('T')[0],
    attendance_rate: student?.attendance_rate || 0,
    joined_date: student?.joined_date || new Date().toISOString().split('T')[0],
    last_attended: student?.last_attended || new Date().toISOString().split('T')[0],
    username: "",
    password: "",
    createAccount: !isEditing,
  });

  // Check auth user status when email changes
  useEffect(() => {
    async function check() {
      if (formData.email) {
        const result = await checkAuthUserByEmail(formData.email);
        setHasAuthUser(result.hasAuthAccount);
        
        // If user already has auth account, set createAccount to true (checked but disabled)
        if (result.hasAuthAccount) {
          setFormData(prev => ({ ...prev, createAccount: true }));
        }
      }
    }
    
    if (formData.email) {
      check();
    }
  }, [formData.email, checkAuthUserByEmail]);

  // Get active coaches for the dropdown
  const activeCoaches = coaches.filter(coach => coach.status === "active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission data:", formData);
    
    if (isEditing && student) {
      onSubmit({
        ...student,
        ...formData,
        subscription_plan_id: formData.subscription_plan_id || null,
        plan_start_date: formData.plan_start_date || null,
        next_due_date: student.next_due_date,
        payment_status: student.payment_status,
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
        subscription_plan_id: formData.subscription_plan_id || null,
        plan_start_date: formData.plan_start_date || null,
        next_due_date: null,
        payment_status: "unpaid",
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

  const isCheckboxDisabled = hasAuthUser;
  const shouldShowAsChecked = hasAuthUser || formData.createAccount;

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

      {/* Account Creation Section - Enhanced with portal access detection */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="createAccount"
            checked={shouldShowAsChecked}
            onChange={(e) => !isCheckboxDisabled && handleChange("createAccount", e.target.checked)}
            disabled={isCheckboxDisabled}
            className="rounded"
          />
          <Label htmlFor="createAccount" className="text-sm font-medium">
            {hasAuthUser ? "Already has portal access" : (isEditing ? "Create student portal account" : "Create student portal account")}
          </Label>
          
          {hasAuthUser && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="secondary" className="ml-2">Portal Access Exists</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This student already has login credentials and can access the portal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {checking && (
            <span className="text-sm text-gray-500 ml-2">Checking...</span>
          )}
        </div>
        
        {hasAuthUser && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            This student already has portal access and can log in with their existing credentials.
          </div>
        )}
        
        {formData.createAccount && !hasAuthUser && (
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
        
        {!formData.createAccount && !hasAuthUser && (
          <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-md">
            The student will be added without portal access. You can create an account later by editing the student.
          </div>
        )}
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
          <Label htmlFor="subscription_plan">Subscription Plan</Label>
          <Select
            value={formData.subscription_plan_id}
            onValueChange={(value) => handleChange("subscription_plan_id", value)}
            disabled={plansLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={plansLoading ? "Loading plans..." : "Select subscription plan"} />
            </SelectTrigger>
            <SelectContent>
              {activeSubscriptionPlans?.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.title} - ${plan.sale_price || plan.standard_price}/{plan.subscription_period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="plan_start_date">Plan Start Date</Label>
          <Input
            id="plan_start_date"
            type="date"
            value={formData.plan_start_date}
            onChange={(e) => handleChange("plan_start_date", e.target.value)}
          />
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
