
export interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  belt: string;
  specialties: string[];
  branch: string;
  status: "active" | "inactive";
  students_count: number;
  assigned_classes?: string[];
  joined_date: string;
  created_at: string;
  updated_at: string;
  is_upgraded_student?: boolean; // Flag to identify coaches upgraded from students
}

// Add account-related properties to CoachInput
export type CoachInput = Omit<Coach, "id" | "created_at" | "updated_at"> & {
  username?: string;
  password?: string;
  createAccount?: boolean;
};

// Add account-related properties to CoachUpdate  
export type CoachUpdate = Partial<Omit<Coach, "id" | "created_at" | "updated_at">> & {
  username?: string;
  password?: string;
  createAccount?: boolean;
};
