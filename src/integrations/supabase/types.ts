export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      branches: {
        Row: {
          active_classes: number | null
          address: string
          capacity: number
          city: string
          created_at: string
          description: string | null
          id: string
          name: string
          phone: string
          status: string | null
          total_students: number | null
          updated_at: string
        }
        Insert: {
          active_classes?: number | null
          address: string
          capacity: number
          city: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          phone: string
          status?: string | null
          total_students?: number | null
          updated_at?: string
        }
        Update: {
          active_classes?: number | null
          address?: string
          capacity?: number
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          phone?: string
          status?: string | null
          total_students?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          capacity: number
          created_at: string
          description: string | null
          duration: number
          enrolled: number
          id: string
          instructor: string
          level: string
          location: string
          name: string
          schedule: string
          status: string
          updated_at: string
        }
        Insert: {
          capacity: number
          created_at?: string
          description?: string | null
          duration: number
          enrolled?: number
          id?: string
          instructor: string
          level: string
          location: string
          name: string
          schedule: string
          status?: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          description?: string | null
          duration?: number
          enrolled?: number
          id?: string
          instructor?: string
          level?: string
          location?: string
          name?: string
          schedule?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      coaches: {
        Row: {
          belt: string
          branch: string
          created_at: string
          email: string
          id: string
          joined_date: string | null
          name: string
          phone: string | null
          specialties: string[] | null
          status: string | null
          students_count: number | null
          updated_at: string
        }
        Insert: {
          belt: string
          branch: string
          created_at?: string
          email: string
          id?: string
          joined_date?: string | null
          name: string
          phone?: string | null
          specialties?: string[] | null
          status?: string | null
          students_count?: number | null
          updated_at?: string
        }
        Update: {
          belt?: string
          branch?: string
          created_at?: string
          email?: string
          id?: string
          joined_date?: string | null
          name?: string
          phone?: string | null
          specialties?: string[] | null
          status?: string | null
          students_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          attendance_rate: number
          belt: string
          branch: string
          coach: string
          created_at: string
          email: string
          id: string
          joined_date: string
          last_attended: string | null
          membership_type: string
          name: string
          phone: string | null
          status: string
          stripes: number
          updated_at: string
        }
        Insert: {
          attendance_rate?: number
          belt: string
          branch: string
          coach: string
          created_at?: string
          email: string
          id?: string
          joined_date?: string
          last_attended?: string | null
          membership_type?: string
          name: string
          phone?: string | null
          status?: string
          stripes?: number
          updated_at?: string
        }
        Update: {
          attendance_rate?: number
          belt?: string
          branch?: string
          coach?: string
          created_at?: string
          email?: string
          id?: string
          joined_date?: string
          last_attended?: string | null
          membership_type?: string
          name?: string
          phone?: string | null
          status?: string
          stripes?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
