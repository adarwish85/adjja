import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCheckAuthUserByEmail } from "./student-auth";
import { useStudentsRealTimeSync } from "./useStudentsRealTimeSync";

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
  subscription_plan_id: string | null;
  plan_start_date: string | null;
  next_due_date: string | null;
  payment_status: "unpaid" | "paid" | "due_soon" | "overdue" | null;
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
  
  // Handle other nullable fields
  if ('phone' in cleaned && (cleaned.phone === "" || cleaned.phone === "undefined")) {
    cleaned.phone = null;
  }
  
  if ('last_attended' in cleaned && (cleaned.last_attended === "" || cleaned.last_attended === "undefined")) {
    cleaned.last_attended = null;
  }

  if ('subscription_plan_id' in cleaned && cleaned.subscription_plan_id === "") {
    cleaned.subscription_plan_id = null;
  }

  if ('plan_start_date' in cleaned && cleaned.plan_start_date === "") {
    cleaned.plan_start_date = null;
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

  // Import the refactored auth helpers
  const { checkAuthUserByEmail } = useCheckAuthUserByEmail();

  const fetchStudents = async () => {
    try {
      console.log('🚀 useStudents: Starting fetchStudents...');
      setLoading(true);
      
      // Test the current session first
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('🔐 useStudents: Current session:', {
        user: sessionData?.session?.user?.email,
        userId: sessionData?.session?.user?.id,
        error: sessionError
      });

      // Test direct query
      console.log('📊 useStudents: Executing students query...');
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("name");

      console.log('📊 useStudents: Raw query result:', {
        data: data,
        dataLength: data?.length,
        error: error,
        errorDetails: error ? JSON.stringify(error, null, 2) : null
      });

      if (error) {
        console.error('❌ useStudents: Database error:', error);
        throw error;
      }

      console.log("✅ useStudents: Fetched students data:", data);
      console.log("📈 useStudents: Number of students:", data?.length || 0);

      // Log each student individually BEFORE typing
      if (data && data.length > 0) {
        console.log('🔍 RAW STUDENTS BEFORE TYPING:');
        data.forEach((student, index) => {
          console.log(`👤 RAW Student ${index + 1}:`, {
            id: student.id,
            name: student.name,
            email: student.email,
            status: student.status,
            created_at: student.created_at,
            fullRecord: student
          });
        });
      }

      // Type the data properly by ensuring fields are correctly typed
      const typedStudents: Student[] = (data || []).map((student, index) => {
        console.log(`🔄 TYPING Student ${index + 1} (${student.name}):`, student);
        const typedStudent = {
          ...student,
          status: student.status as "active" | "inactive" | "on-hold",
          membership_type: student.membership_type as "monthly" | "yearly" | "unlimited",
          payment_status: student.payment_status as "unpaid" | "paid" | "due_soon" | "overdue" | null,
          phone: student.phone || null,
          last_attended: student.last_attended || null,
          subscription_plan_id: student.subscription_plan_id || null,
          plan_start_date: student.plan_start_date || null,
          next_due_date: student.next_due_date || null,
          stripes: student.stripes || 0,
          attendance_rate: student.attendance_rate || 0
        };
        console.log(`✅ TYPED Student ${index + 1}:`, typedStudent);
        return typedStudent;
      });

      console.log("🔄 useStudents: ALL TYPED students about to be set:", typedStudents);
      console.log("🔢 useStudents: Typed students count:", typedStudents.length);
      
      // Log each typed student individually
      typedStudents.forEach((student, index) => {
        console.log(`🎯 FINAL Student ${index + 1} to be set:`, {
          id: student.id,
          name: student.name,
          email: student.email,
          status: student.status
        });
      });

      console.log('🎭 BEFORE setStudents call - About to set:', typedStudents.length, 'students');
      setStudents(typedStudents);
      console.log('🎭 AFTER setStudents call - State should now contain:', typedStudents.length, 'students');
      
    } catch (error) {
      console.error("❌ useStudents: Error in fetchStudents:", error);
      console.error("❌ useStudents: Error stack:", error.stack);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
      console.log("🏁 useStudents: fetchStudents completed, loading set to false");
    }
  };

  // Set up real-time sync
  useStudentsRealTimeSync({
    onStudentAdded: () => {
      console.log("Real-time: Student added, refreshing...");
      fetchStudents();
    },
    onStudentUpdated: () => {
      console.log("Real-time: Student updated, refreshing...");
      fetchStudents();
    },
    onStudentRemoved: () => {
      console.log("Real-time: Student removed, refreshing...");
      fetchStudents();
    },
    onStudentRoleChanged: () => {
      console.log("Real-time: Student role changed, refreshing...");
      fetchStudents();
    },
  });

  const addStudent = async (studentData: Omit<Student, "id" | "created_at" | "updated_at">, classIds?: string[]) => {
    try {
      console.log("Adding student with data:", studentData);
      console.log("Class IDs to enroll in:", classIds);
      
      // Check for existing auth user before creating one
      if (studentData.createAccount && studentData.username && studentData.password) {
        // Use email for existing check
        const alreadyExists = await checkAuthUserByEmail(studentData.email);
        if (alreadyExists) {
          toast.error("An Auth user already exists for this email. You cannot create another account for this student.");
          throw new Error("Auth user already exists for this email.");
        }
        
        // Account creation code as before...
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
        
        // Set the auth_user_id for the student record
        const authUserId = accountData;
        studentData = { ...studentData, auth_user_id: authUserId } as any;
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

      // Enroll student in selected classes
      if (classIds && classIds.length > 0) {
        console.log("Enrolling student in classes:", classIds);
        for (const classId of classIds) {
          try {
            const { error: enrollmentError } = await supabase.rpc('enroll_student_in_class', {
              p_student_id: data.id,
              p_class_id: classId
            });

            if (enrollmentError) {
              console.error("Error enrolling in class:", classId, enrollmentError);
              // Continue with other enrollments even if one fails
            } else {
              console.log("Successfully enrolled in class:", classId);
            }
          } catch (enrollError) {
            console.error("Unexpected error enrolling in class:", classId, enrollError);
          }
        }
        toast.success(`Student added and enrolled in ${classIds.length} class(es)`);
      } else {
        toast.success("Student added successfully");
      }

      const typedStudent: Student = {
        ...data,
        status: data.status as "active" | "inactive" | "on-hold",
        membership_type: data.membership_type as "monthly" | "yearly" | "unlimited",
        payment_status: data.payment_status as "unpaid" | "paid" | "due_soon" | "overdue" | null,
        phone: data.phone || null,
        last_attended: data.last_attended || null,
        subscription_plan_id: data.subscription_plan_id || null,
        plan_start_date: data.plan_start_date || null,
        next_due_date: data.next_due_date || null,
        stripes: data.stripes || 0,
        attendance_rate: data.attendance_rate || 0
      };

      setStudents(prev => [...prev, typedStudent]);
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
        
        // Add the auth_user_id to updates
        updates = { ...updates, auth_user_id: accountData } as any;
      }

      // Clean the update data
      const cleanUpdates = cleanUpdateData(updates);
      console.log("useStudents: Clean updates to send:", cleanUpdates);
      
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

      const typedStudent: Student = {
        ...data,
        status: data.status as "active" | "inactive" | "on-hold",
        membership_type: data.membership_type as "monthly" | "yearly" | "unlimited",
        payment_status: data.payment_status as "unpaid" | "paid" | "due_soon" | "overdue" | null,
        phone: data.phone || null,
        last_attended: data.last_attended || null,
        subscription_plan_id: data.subscription_plan_id || null,
        plan_start_date: data.plan_start_date || null,
        next_due_date: data.next_due_date || null,
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
    console.log('🔄 useStudents: useEffect triggered, calling fetchStudents');
    fetchStudents();
  }, []);

  // Enhanced logging for students state changes
  useEffect(() => {
    console.log('📊 useStudents: Students state changed:', {
      count: students?.length || 0,
      students: students,
      individualStudents: students?.map((s, i) => ({ index: i, id: s.id, name: s.name }))
    });
    
    if (students && students.length > 0) {
      console.log('🎯 CURRENT STUDENTS IN STATE:');
      students.forEach((student, index) => {
        console.log(`🏆 State Student ${index + 1}:`, {
          id: student.id,
          name: student.name,
          email: student.email,
          status: student.status
        });
      });
    }
  }, [students]);

  return {
    students,
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: fetchStudents,
  };
};
