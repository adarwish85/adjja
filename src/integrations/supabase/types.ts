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
      attendance_records: {
        Row: {
          attendance_date: string
          checked_in_by: string | null
          class_id: string
          counted_against_quota: boolean | null
          created_at: string
          id: string
          marked_at: string
          marked_by: string | null
          source: string | null
          status: string
          student_id: string
        }
        Insert: {
          attendance_date?: string
          checked_in_by?: string | null
          class_id: string
          counted_against_quota?: boolean | null
          created_at?: string
          id?: string
          marked_at?: string
          marked_by?: string | null
          source?: string | null
          status?: string
          student_id: string
        }
        Update: {
          attendance_date?: string
          checked_in_by?: string | null
          class_id?: string
          counted_against_quota?: boolean | null
          created_at?: string
          id?: string
          marked_at?: string
          marked_by?: string | null
          source?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "analytics_class_performance"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "attendance_records_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_sessions: {
        Row: {
          class_id: string
          created_at: string
          end_time: string | null
          id: string
          instructor_id: string | null
          session_date: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          end_time?: string | null
          id?: string
          instructor_id?: string | null
          session_date?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          end_time?: string | null
          id?: string
          instructor_id?: string | null
          session_date?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_sessions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "analytics_class_performance"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "attendance_sessions_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_sessions_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_tracking: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          early_departure_minutes: number | null
          id: string
          late_minutes: number | null
          marked_by: string | null
          notes: string | null
          session_id: string
          status: string
          student_id: string
          sync_status: string | null
          updated_at: string
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          early_departure_minutes?: number | null
          id?: string
          late_minutes?: number | null
          marked_by?: string | null
          notes?: string | null
          session_id: string
          status?: string
          student_id: string
          sync_status?: string | null
          updated_at?: string
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          early_departure_minutes?: number | null
          id?: string
          late_minutes?: number | null
          marked_by?: string | null
          notes?: string | null
          session_id?: string
          status?: string
          student_id?: string
          sync_status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_tracking_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_tracking_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "attendance_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_tracking_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "attendance_tracking_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      bjj_profiles: {
        Row: {
          about_me: string | null
          academy_team: string | null
          belt_rank: string | null
          bjj_heroes_url: string | null
          bronze_medals: number | null
          competitions_count: number | null
          created_at: string | null
          facebook_url: string | null
          favorite_position: string | null
          favorite_submission: string | null
          gallery_images: Json | null
          gold_medals: number | null
          height_cm: number | null
          id: string
          instagram_url: string | null
          is_public: boolean | null
          notable_wins: string | null
          other_link_1: string | null
          other_link_1_name: string | null
          other_link_2: string | null
          other_link_2_name: string | null
          profile_slug: string | null
          profile_views: number | null
          silver_medals: number | null
          smoothcomp_url: string | null
          updated_at: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          about_me?: string | null
          academy_team?: string | null
          belt_rank?: string | null
          bjj_heroes_url?: string | null
          bronze_medals?: number | null
          competitions_count?: number | null
          created_at?: string | null
          facebook_url?: string | null
          favorite_position?: string | null
          favorite_submission?: string | null
          gallery_images?: Json | null
          gold_medals?: number | null
          height_cm?: number | null
          id?: string
          instagram_url?: string | null
          is_public?: boolean | null
          notable_wins?: string | null
          other_link_1?: string | null
          other_link_1_name?: string | null
          other_link_2?: string | null
          other_link_2_name?: string | null
          profile_slug?: string | null
          profile_views?: number | null
          silver_medals?: number | null
          smoothcomp_url?: string | null
          updated_at?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          about_me?: string | null
          academy_team?: string | null
          belt_rank?: string | null
          bjj_heroes_url?: string | null
          bronze_medals?: number | null
          competitions_count?: number | null
          created_at?: string | null
          facebook_url?: string | null
          favorite_position?: string | null
          favorite_submission?: string | null
          gallery_images?: Json | null
          gold_medals?: number | null
          height_cm?: number | null
          id?: string
          instagram_url?: string | null
          is_public?: boolean | null
          notable_wins?: string | null
          other_link_1?: string | null
          other_link_1_name?: string | null
          other_link_2?: string | null
          other_link_2_name?: string | null
          profile_slug?: string | null
          profile_views?: number | null
          silver_medals?: number | null
          smoothcomp_url?: string | null
          updated_at?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bjj_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      certificates: {
        Row: {
          certificate_number: string
          certificate_url: string | null
          course_id: string
          id: string
          issued_date: string
          student_id: string
        }
        Insert: {
          certificate_number?: string
          certificate_url?: string | null
          course_id: string
          id?: string
          issued_date?: string
          student_id: string
        }
        Update: {
          certificate_number?: string
          certificate_url?: string | null
          course_id?: string
          id?: string
          issued_date?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      class_enrollments: {
        Row: {
          class_id: string
          created_at: string
          enrollment_date: string
          id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          enrollment_date?: string
          id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "analytics_class_performance"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "class_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "class_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
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
      coach_feed_posts: {
        Row: {
          coach_id: string
          content: string
          created_at: string | null
          id: string
          is_public: boolean | null
          post_type: string
          target_classes: string[] | null
          target_students: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          coach_id: string
          content: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          post_type?: string
          target_classes?: string[] | null
          target_students?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          coach_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          post_type?: string
          target_classes?: string[] | null
          target_students?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      coach_notes: {
        Row: {
          class_id: string | null
          coach_id: string
          created_at: string | null
          id: string
          note_content: string
          session_date: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          class_id?: string | null
          coach_id: string
          created_at?: string | null
          id?: string
          note_content: string
          session_date?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string | null
          coach_id?: string
          created_at?: string | null
          id?: string
          note_content?: string
          session_date?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_notes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "analytics_class_performance"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "coach_notes_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "coach_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_profiles: {
        Row: {
          assigned_classes: string[] | null
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          featured_media: Json | null
          id: string
          rank: string | null
          social_media: Json | null
          specialties: string[] | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          assigned_classes?: string[] | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          featured_media?: Json | null
          id?: string
          rank?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          assigned_classes?: string[] | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          featured_media?: Json | null
          id?: string
          rank?: string | null
          social_media?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      coaches: {
        Row: {
          assigned_classes: string[] | null
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
          assigned_classes?: string[] | null
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
          assigned_classes?: string[] | null
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
      content_library: {
        Row: {
          course_id: string | null
          created_at: string
          downloads: number | null
          duration_seconds: number | null
          file_size: number | null
          file_url: string
          id: string
          status: string | null
          title: string
          type: string
          updated_at: string
          uploaded_by: string | null
          views: number | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          downloads?: number | null
          duration_seconds?: number | null
          file_size?: number | null
          file_url: string
          id?: string
          status?: string | null
          title: string
          type: string
          updated_at?: string
          uploaded_by?: string | null
          views?: number | null
        }
        Update: {
          course_id?: string | null
          created_at?: string
          downloads?: number | null
          duration_seconds?: number | null
          file_size?: number | null
          file_url?: string
          id?: string
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
          uploaded_by?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_library_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completion_date: string | null
          course_id: string
          enrolled_by: string | null
          enrollment_date: string
          id: string
          note: string | null
          progress_percentage: number | null
          start_date: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          completion_date?: string | null
          course_id: string
          enrolled_by?: string | null
          enrollment_date?: string
          id?: string
          note?: string | null
          progress_percentage?: number | null
          start_date?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          completion_date?: string | null
          course_id?: string
          enrolled_by?: string | null
          enrollment_date?: string
          id?: string
          note?: string | null
          progress_percentage?: number | null
          start_date?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "course_enrollments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          attachments: string[] | null
          content: string | null
          created_at: string
          duration_minutes: number | null
          featured_image: string | null
          id: string
          is_preview: boolean | null
          order_index: number
          title: string
          topic_id: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          attachments?: string[] | null
          content?: string | null
          created_at?: string
          duration_minutes?: number | null
          featured_image?: string | null
          id?: string
          is_preview?: boolean | null
          order_index?: number
          title: string
          topic_id: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          attachments?: string[] | null
          content?: string | null
          created_at?: string
          duration_minutes?: number | null
          featured_image?: string | null
          id?: string
          is_preview?: boolean | null
          order_index?: number
          title?: string
          topic_id?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "course_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      course_quizzes: {
        Row: {
          attempts_allowed: number | null
          created_at: string
          description: string | null
          feedback_mode: string | null
          id: string
          order_index: number
          passing_grade: number | null
          show_timer: boolean | null
          time_limit: number | null
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          attempts_allowed?: number | null
          created_at?: string
          description?: string | null
          feedback_mode?: string | null
          id?: string
          order_index?: number
          passing_grade?: number | null
          show_timer?: boolean | null
          time_limit?: number | null
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          attempts_allowed?: number | null
          created_at?: string
          description?: string | null
          feedback_mode?: string | null
          id?: string
          order_index?: number
          passing_grade?: number | null
          show_timer?: boolean | null
          time_limit?: number | null
          title?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_quizzes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "course_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      course_topics: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_videos: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean | null
          order_index: number
          status: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_index: number
          status?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_index?: number
          status?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          instructor: string
          intro_video: string | null
          learning_outcomes: string[] | null
          level: string
          price: number | null
          rating: number | null
          requirements: string | null
          status: string | null
          thumbnail_url: string | null
          title: string
          total_students: number | null
          total_videos: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor: string
          intro_video?: string | null
          learning_outcomes?: string[] | null
          level?: string
          price?: number | null
          rating?: number | null
          requirements?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          total_students?: number | null
          total_videos?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor?: string
          intro_video?: string | null
          learning_outcomes?: string[] | null
          level?: string
          price?: number | null
          rating?: number | null
          requirements?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          total_students?: number | null
          total_videos?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      lms_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          end_date: string
          id: string
          price: number
          start_date: string
          status: string | null
          student_id: string
          subscription_type: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          end_date: string
          id?: string
          price: number
          start_date?: string
          status?: string | null
          student_id: string
          subscription_type: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          end_date?: string
          id?: string
          price?: number
          start_date?: string
          status?: string | null
          student_id?: string
          subscription_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lms_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "lms_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          customer_email: string | null
          id: string
          product_id: string | null
          product_type: string | null
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          id?: string
          product_id?: string | null
          product_type?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          id?: string
          product_id?: string | null
          product_type?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_reminders: {
        Row: {
          created_at: string
          id: string
          next_reminder_date: string | null
          reminder_type: string
          sent_date: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          next_reminder_date?: string | null
          reminder_type: string
          sent_date?: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          next_reminder_date?: string | null
          reminder_type?: string
          sent_date?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_reminders_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "payment_reminders_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          paypal_order_id: string | null
          paypal_transaction_id: string | null
          status: string
          student_id: string
          subscription_plan_id: string | null
          transaction_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          paypal_order_id?: string | null
          paypal_transaction_id?: string | null
          status?: string
          student_id: string
          subscription_plan_id?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paypal_order_id?: string | null
          paypal_transaction_id?: string | null
          status?: string
          student_id?: string
          subscription_plan_id?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "payment_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_completion_audit: {
        Row: {
          completed_at: string | null
          field_data: Json | null
          id: string
          step_completed: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          field_data?: Json | null
          id?: string
          step_completed: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          field_data?: Json | null
          id?: string
          step_completed?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          birthdate: string | null
          cover_photo_url: string | null
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          mandatory_fields_completed: boolean | null
          name: string
          phone: string | null
          profile_completed: boolean | null
          profile_picture_url: string | null
          rejection_reason: string | null
          role_id: string | null
          status: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          birthdate?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          email: string
          id: string
          last_login?: string | null
          mandatory_fields_completed?: boolean | null
          name: string
          phone?: string | null
          profile_completed?: boolean | null
          profile_picture_url?: string | null
          rejection_reason?: string | null
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          birthdate?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          mandatory_fields_completed?: boolean | null
          name?: string
          phone?: string | null
          profile_completed?: boolean | null
          profile_picture_url?: string | null
          rejection_reason?: string | null
          role_id?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_videos: {
        Row: {
          class_id: string | null
          coach_id: string
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          id: string
          student_id: string
          updated_at: string | null
          upload_date: string | null
          video_url: string
        }
        Insert: {
          class_id?: string | null
          coach_id: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          student_id: string
          updated_at?: string | null
          upload_date?: string | null
          video_url: string
        }
        Update: {
          class_id?: string | null
          coach_id?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          id?: string
          student_id?: string
          updated_at?: string | null
          upload_date?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_videos_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "analytics_class_performance"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "progress_videos_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_videos_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "progress_videos_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string | null
          created_at: string
          id: string
          options: string[] | null
          order_index: number
          points: number | null
          question: string
          question_type: string
          quiz_id: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          id?: string
          options?: string[] | null
          order_index?: number
          points?: number | null
          question: string
          question_type: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          id?: string
          options?: string[] | null
          order_index?: number
          points?: number | null
          question?: string
          question_type?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "course_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subscriptions: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          next_due_date: string | null
          payment_status: string
          start_date: string
          student_id: string
          subscription_plan_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          next_due_date?: string | null
          payment_status?: string
          start_date?: string
          student_id: string
          subscription_plan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          next_due_date?: string | null
          payment_status?: string
          start_date?: string
          student_id?: string
          subscription_plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_attendance_stats"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_subscriptions_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          attendance_rate: number
          auth_user_id: string | null
          belt: string
          branch: string
          coach: string
          coach_user_id: string | null
          created_at: string
          email: string
          id: string
          joined_date: string
          last_attended: string | null
          membership_type: string
          name: string
          next_due_date: string | null
          payment_status: string | null
          phone: string | null
          plan_start_date: string | null
          status: string
          stripes: number
          subscription_plan_id: string | null
          updated_at: string
        }
        Insert: {
          attendance_rate?: number
          auth_user_id?: string | null
          belt: string
          branch: string
          coach: string
          coach_user_id?: string | null
          created_at?: string
          email: string
          id?: string
          joined_date?: string
          last_attended?: string | null
          membership_type?: string
          name: string
          next_due_date?: string | null
          payment_status?: string | null
          phone?: string | null
          plan_start_date?: string | null
          status?: string
          stripes?: number
          subscription_plan_id?: string | null
          updated_at?: string
        }
        Update: {
          attendance_rate?: number
          auth_user_id?: string | null
          belt?: string
          branch?: string
          coach?: string
          coach_user_id?: string | null
          created_at?: string
          email?: string
          id?: string
          joined_date?: string
          last_attended?: string | null
          membership_type?: string
          name?: string
          next_due_date?: string | null
          payment_status?: string | null
          phone?: string | null
          plan_start_date?: string | null
          status?: string
          stripes?: number
          subscription_plan_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_subscription_plan_id_fkey"
            columns: ["subscription_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          number_of_classes: number
          sale_price: number | null
          standard_price: number
          subscription_period: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          number_of_classes: number
          sale_price?: number | null
          standard_price: number
          subscription_period: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          number_of_classes?: number
          sale_price?: number | null
          standard_price?: number
          subscription_period?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          branch_id: string | null
          category: string
          created_at: string | null
          created_by: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          branch_id?: string | null
          category: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          branch_id?: string | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings_history: {
        Row: {
          change_reason: string | null
          changed_at: string | null
          changed_by: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          setting_id: string | null
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          setting_id?: string | null
        }
        Update: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          setting_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_settings_history_setting_id_fkey"
            columns: ["setting_id"]
            isOneToOne: false
            referencedRelation: "system_settings"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          category: string
          created_at: string | null
          details: string | null
          id: string
          ip_address: string | null
          status: string | null
          user_agent: string | null
          user_id: string
          user_name: string
        }
        Insert: {
          action: string
          category: string
          created_at?: string | null
          details?: string | null
          id?: string
          ip_address?: string | null
          status?: string | null
          user_agent?: string | null
          user_id: string
          user_name: string
        }
        Update: {
          action?: string
          category?: string
          created_at?: string | null
          details?: string | null
          id?: string
          ip_address?: string | null
          status?: string | null
          user_agent?: string | null
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          granted: boolean | null
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          granted?: boolean | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          granted?: boolean | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_system: boolean | null
          name: string
          permissions: string[] | null
          updated_at: string | null
          user_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          permissions?: string[] | null
          updated_at?: string | null
          user_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          permissions?: string[] | null
          updated_at?: string | null
          user_count?: number | null
        }
        Relationships: []
      }
      video_progress: {
        Row: {
          completed: boolean | null
          enrollment_id: string
          id: string
          last_watched: string | null
          video_id: string
          watch_time_seconds: number | null
        }
        Insert: {
          completed?: boolean | null
          enrollment_id: string
          id?: string
          last_watched?: string | null
          video_id: string
          watch_time_seconds?: number | null
        }
        Update: {
          completed?: boolean | null
          enrollment_id?: string
          id?: string
          last_watched?: string | null
          video_id?: string
          watch_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "course_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "course_videos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      analytics_class_performance: {
        Row: {
          absent_count: number | null
          capacity: number | null
          class_id: string | null
          class_name: string | null
          enrolled: number | null
          instructor: string | null
          present_count: number | null
          total_attendances: number | null
          utilization_percentage: number | null
        }
        Relationships: []
      }
      analytics_revenue_metrics: {
        Row: {
          month: string | null
          plan_name: string | null
          subscription_period: string | null
          total_revenue: number | null
          transaction_count: number | null
        }
        Relationships: []
      }
      analytics_student_metrics: {
        Row: {
          active_students: number | null
          inactive_students: number | null
          month: string | null
          new_students: number | null
        }
        Relationships: []
      }
      student_attendance_stats: {
        Row: {
          attendance_percentage: number | null
          attended_sessions: number | null
          early_departure_sessions: number | null
          email: string | null
          last_attended: string | null
          late_sessions: number | null
          name: string | null
          student_id: string | null
          total_sessions: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      approve_user_profile: {
        Args: { p_user_id: string; p_approved_by: string }
        Returns: boolean
      }
      calculate_attendance_streak: {
        Args: { p_student_id: string }
        Returns: {
          current_streak: number
          longest_streak: number
        }[]
      }
      calculate_next_due_date: {
        Args: { period_type: string; from_date?: string }
        Returns: string
      }
      calculate_next_due_date_for_student: {
        Args: { p_student_id: string; p_start_date?: string }
        Returns: string
      }
      create_student_account: {
        Args: {
          p_email: string
          p_password: string
          p_username: string
          p_name: string
          p_phone?: string
        }
        Returns: string
      }
      downgrade_coach_to_student: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      enroll_student_in_class: {
        Args: { p_student_id: string; p_class_id: string }
        Returns: string
      }
      generate_profile_slug: {
        Args: { p_user_id: string; p_name: string }
        Returns: string
      }
      get_attendance_heatmap: {
        Args: { start_date?: string; end_date?: string }
        Returns: {
          day_of_week: number
          hour_of_day: number
          attendance_count: number
        }[]
      }
      get_available_classes_for_student: {
        Args: { p_student_id: string }
        Returns: {
          class_id: string
          class_name: string
          instructor: string
          schedule: string
          already_checked_in: boolean
          is_enrolled: boolean
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_setting_value: {
        Args: { p_category: string; p_key: string; p_branch_id?: string }
        Returns: Json
      }
      get_setting_value_safe: {
        Args: { p_category: string; p_key: string; p_branch_id?: string }
        Returns: Json
      }
      mark_attendance: {
        Args: {
          p_session_id: string
          p_student_id: string
          p_status: string
          p_marked_by: string
          p_sync_status?: string
        }
        Returns: Json
      }
      process_attendance_checkin: {
        Args: {
          p_student_id: string
          p_class_id: string
          p_checked_in_by: string
          p_source?: string
        }
        Returns: Json
      }
      refresh_analytics_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_attendance_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reject_user_profile: {
        Args: { p_user_id: string; p_rejected_by: string; p_reason: string }
        Returns: boolean
      }
      start_attendance_session: {
        Args: {
          p_class_id: string
          p_instructor_id: string
          p_session_date?: string
        }
        Returns: string
      }
      sync_student_auth_links: {
        Args: Record<PropertyKey, never>
        Returns: {
          student_id: string
          student_email: string
          auth_user_id: string
          action: string
        }[]
      }
      unenroll_student_from_class: {
        Args: { p_student_id: string; p_class_id: string }
        Returns: boolean
      }
      update_coach_student_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_setting: {
        Args:
          | {
              p_category: string
              p_key: string
              p_value: Json
              p_branch_id?: string
            }
          | {
              p_category: string
              p_key: string
              p_value: Json
              p_branch_id?: string
              p_user_id?: string
            }
        Returns: string
      }
      update_student_payment_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      upgrade_student_to_coach_with_autofix: {
        Args: { p_student_id: string }
        Returns: Json
      }
      upgrade_user_to_coach: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      validate_student_auth_links: {
        Args: Record<PropertyKey, never>
        Returns: {
          student_id: string
          student_name: string
          student_email: string
          has_auth_account: boolean
          auth_user_id: string
          issue_description: string
        }[]
      }
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
