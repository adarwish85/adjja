
export interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  belt: string;
  specialties: string[];
  status: "active" | "inactive";
  students_count: number;
  joined_date: string;
  assigned_classes: string[];
  created_at: string;
  updated_at: string;
  // Optional fields for account creation
  username?: string;
  password?: string;
  createAccount?: boolean;
}

export type CoachInput = Omit<Coach, "id" | "created_at" | "updated_at">;
export type CoachUpdate = Partial<Omit<Coach, "id" | "created_at" | "updated_at">>;
