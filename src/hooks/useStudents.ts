import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  branch: string;
  belt: string;
  stripes: number;
  coach: string;
  status: "active" | "inactive" | "on-hold";
  membership_type: "monthly" | "yearly" | "unlimited";
  attendance_rate: number;
  joined_date: string;
  last_attended: string | null;
  created_at: string;
  updated_at: string;
  // Optional fields for account creation
  username?: string;
  password?: string;
  createAccount?: boolean;
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("name");

      if (error) throw error;

      console.log("Fetched students data:", data);

      // Type the data properly by ensuring fields are correctly typed
      const typedStudents: Student[] = (data || []).map(student => ({
        ...student,
        status: student.status as "active" | "inactive" | "on-hold",
        membership_type: student.membership_type as "monthly" | "yearly" | "unlimited",
        phone: student.phone || null,
        last_attended: student.last_attended || null,
        stripes: student.stripes || 0,
        attendance_rate: student.attendance_rate || 0
      }));

      setStudents(typedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (studentData: Omit<Student, "id" | "created_at" | "updated_at">) => {
    try {
      console.log("Adding student with data:", studentData);
      
      // If account creation is requested, create the user account first
      if (studentData.createAccount && studentData.username && studentData.password) {
        console.log("Creating student account...");
        
        // Call the database function to create the student account
        const { data: accountData, error: accountError } = await supabase.rpc('create_student_account', {
          p_email: studentData.email,
          p_password: studentData.password,
          p_username: studentData.username,
          p_name: studentData.name,
          p_phone: studentData.phone
        });

        if (accountError) {
          console.error("Account creation error:", accountError);
          throw new Error(`Failed to create student account: ${accountError.message}`);
        }

        console.log("Student account created successfully:", accountData);
        toast.success("Student account created successfully");
      }

      // Create the student record (remove account-specific fields)
      const { username, password, createAccount, ...studentRecord } = studentData;
      
      const { data, error } = await supabase
        .from("students")
        .insert([studentRecord])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Successfully added student:", data);

      const typedStudent: Student = {
        ...data,
        status: data.status as "active" | "inactive" | "on-hold",
        membership_type: data.membership_type as "monthly" | "yearly" | "unlimited",
        phone: data.phone || null,
        last_attended: data.last_attended || null,
        stripes: data.stripes || 0,
        attendance_rate: data.attendance_rate || 0
      };

      setStudents(prev => [...prev, typedStudent]);
      toast.success("Student added successfully");
      return typedStudent;
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add student");
      throw error;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Omit<Student, "id" | "created_at" | "updated_at">>) => {
    try {
      console.log("Updating student with id:", id, "data:", updates);
      
      // If account creation is requested during update, create the user account first
      if (updates.createAccount && updates.username && updates.password) {
        console.log("Creating student account during update...");
        
        // Call the database function to create the student account
        const { data: accountData, error: accountError } = await supabase.rpc('create_student_account', {
          p_email: updates.email || "",
          p_password: updates.password,
          p_username: updates.username,
          p_name: updates.name || "",
          p_phone: updates.phone
        });

        if (accountError) {
          console.error("Account creation error:", accountError);
          throw new Error(`Failed to create student account: ${accountError.message}`);
        }

        console.log("Student account created successfully during update:", accountData);
        toast.success("Student account created successfully");
      }

      // Remove account-specific fields before updating the student record
      const { username, password, createAccount, ...studentUpdates } = updates;
      
      const { data, error } = await supabase
        .from("students")
        .update(studentUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      const typedStudent: Student = {
        ...data,
        status: data.status as "active" | "inactive" | "on-hold",
        membership_type: data.membership_type as "monthly" | "yearly" | "unlimited",
        phone: data.phone || null,
        last_attended: data.last_attended || null,
        stripes: data.stripes || 0,
        attendance_rate: data.attendance_rate || 0
      };

      setStudents(prev => prev.map(student => student.id === id ? typedStudent : student));
      toast.success("Student updated successfully");
      return typedStudent;
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student");
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      toast.success("Student deleted successfully");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
      throw error;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents,
  };
};
