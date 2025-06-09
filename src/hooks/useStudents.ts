
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
  class_enrollment?: string | null;
  created_at: string;
  updated_at: string;
  // Optional fields for account creation
  username?: string;
  password?: string;
  createAccount?: boolean;
}

// Helper function to validate UUID
const isValidUUID = (uuid: string | null | undefined): boolean => {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to clean update data
const cleanUpdateData = (data: any) => {
  const cleaned = { ...data };
  
  // Remove read-only fields
  delete cleaned.id;
  delete cleaned.created_at;
  delete cleaned.updated_at;
  delete cleaned.username;
  delete cleaned.password;
  delete cleaned.createAccount;
  
  // Handle UUID fields - convert invalid values to null
  if ('class_enrollment' in cleaned) {
    if (cleaned.class_enrollment === "undefined" || cleaned.class_enrollment === "" || !isValidUUID(cleaned.class_enrollment)) {
      cleaned.class_enrollment = null;
    }
  }
  
  // Handle other nullable fields
  if ('phone' in cleaned && (cleaned.phone === "" || cleaned.phone === "undefined")) {
    cleaned.phone = null;
  }
  
  if ('last_attended' in cleaned && (cleaned.last_attended === "" || cleaned.last_attended === "undefined")) {
    cleaned.last_attended = null;
  }
  
  // Remove undefined values
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });
  
  return cleaned;
};

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

      console.log("useStudents: Fetched students data:", data);

      // Type the data properly by ensuring fields are correctly typed
      const typedStudents: Student[] = (data || []).map(student => ({
        ...student,
        status: student.status as "active" | "inactive" | "on-hold",
        membership_type: student.membership_type as "monthly" | "yearly" | "unlimited",
        phone: student.phone || null,
        last_attended: student.last_attended || null,
        class_enrollment: student.class_enrollment || null,
        stripes: student.stripes || 0,
        attendance_rate: student.attendance_rate || 0
      }));

      setStudents(typedStudents);
    } catch (error) {
      console.error("useStudents: Error fetching students:", error);
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

      // If student is enrolled in a class, create the enrollment record
      if (studentRecord.class_enrollment) {
        const { error: enrollmentError } = await supabase.rpc('enroll_student_in_class', {
          p_student_id: data.id,
          p_class_id: studentRecord.class_enrollment
        });

        if (enrollmentError) {
          console.error("Enrollment error:", enrollmentError);
          toast.error("Student added but failed to enroll in class");
        } else {
          console.log("Student enrolled in class successfully");
        }
      }

      const typedStudent: Student = {
        ...data,
        status: data.status as "active" | "inactive" | "on-hold",
        membership_type: data.membership_type as "monthly" | "yearly" | "unlimited",
        phone: data.phone || null,
        last_attended: data.last_attended || null,
        class_enrollment: data.class_enrollment || null,
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
      console.log("useStudents: Updating student with id:", id, "raw updates:", updates);
      
      // If account creation is requested during update, create the user account first
      if (updates.createAccount && updates.username && updates.password) {
        console.log("useStudents: Creating student account during update...");
        
        // Get the current student data for the email
        const currentStudent = students.find(s => s.id === id);
        if (!currentStudent) {
          throw new Error("Student not found");
        }
        
        // Call the database function to create the student account
        const { data: accountData, error: accountError } = await supabase.rpc('create_student_account', {
          p_email: updates.email || currentStudent.email,
          p_password: updates.password,
          p_username: updates.username,
          p_name: updates.name || currentStudent.name,
          p_phone: updates.phone || currentStudent.phone
        });

        if (accountError) {
          console.error("useStudents: Account creation error:", accountError);
          throw new Error(`Failed to create student account: ${accountError.message}`);
        }

        console.log("useStudents: Student account created successfully during update:", accountData);
        toast.success("Student account created successfully");
      }

      // Handle class enrollment changes
      const currentStudent = students.find(s => s.id === id);
      const oldClassId = currentStudent?.class_enrollment;
      const newClassId = updates.class_enrollment;

      // Clean the update data
      const cleanUpdates = cleanUpdateData(updates);
      console.log("useStudents: Clean updates to send:", cleanUpdates);
      
      // Validate UUID field if present
      if (cleanUpdates.class_enrollment && !isValidUUID(cleanUpdates.class_enrollment)) {
        console.error("useStudents: Invalid UUID for class_enrollment:", cleanUpdates.class_enrollment);
        throw new Error("Invalid class selection");
      }
      
      const { data, error } = await supabase
        .from("students")
        .update(cleanUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("useStudents: Supabase update error:", error);
        throw error;
      }

      console.log("useStudents: Successfully updated student:", data);

      // Handle class enrollment/unenrollment
      if (oldClassId !== newClassId) {
        // Unenroll from old class if exists
        if (oldClassId && isValidUUID(oldClassId)) {
          const { error: unenrollError } = await supabase.rpc('unenroll_student_from_class', {
            p_student_id: id,
            p_class_id: oldClassId
          });
          
          if (unenrollError) {
            console.error("useStudents: Unenrollment error:", unenrollError);
          } else {
            console.log("useStudents: Successfully unenrolled from old class");
          }
        }

        // Enroll in new class if provided and valid
        if (newClassId && isValidUUID(newClassId)) {
          const { error: enrollmentError } = await supabase.rpc('enroll_student_in_class', {
            p_student_id: id,
            p_class_id: newClassId
          });

          if (enrollmentError) {
            console.error("useStudents: Enrollment error:", enrollmentError);
            toast.error("Student updated but failed to enroll in new class");
          } else {
            console.log("useStudents: Student enrolled in new class successfully");
          }
        }
      }

      const typedStudent: Student = {
        ...data,
        status: data.status as "active" | "inactive" | "on-hold",
        membership_type: data.membership_type as "monthly" | "yearly" | "unlimited",
        phone: data.phone || null,
        last_attended: data.last_attended || null,
        class_enrollment: data.class_enrollment || null,
        stripes: data.stripes || 0,
        attendance_rate: data.attendance_rate || 0
      };

      setStudents(prev => prev.map(student => student.id === id ? typedStudent : student));
      toast.success("Student updated successfully");
      return typedStudent;
    } catch (error) {
      console.error("useStudents: Error updating student:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update student");
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
