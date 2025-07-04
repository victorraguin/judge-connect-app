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
      conversations: {
        Row: {
          ended_at: string | null
          id: string
          judge_id: string
          last_message_at: string
          question_id: string
          started_at: string
          status: Database["public"]["Enums"]["conversation_status"]
          user_id: string
        }
        Insert: {
          ended_at?: string | null
          id?: string
          judge_id: string
          last_message_at?: string
          question_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["conversation_status"]
          user_id: string
        }
        Update: {
          ended_at?: string | null
          id?: string
          judge_id?: string
          last_message_at?: string
          question_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["conversation_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          admin_notes: string | null
          conversation_id: string
          created_at: string
          id: string
          judge_id: string
          judge_justification: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          user_id: string
          user_justification: string
        }
        Insert: {
          admin_notes?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          judge_id: string
          judge_justification?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          user_id: string
          user_justification: string
        }
        Update: {
          admin_notes?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          judge_id?: string
          judge_justification?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          user_id?: string
          user_justification?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      judge_info: {
        Row: {
          average_rating: number | null
          average_response_time: unknown | null
          badges: string[] | null
          bio: string | null
          created_at: string
          id: string
          is_available: boolean | null
          judge_level: Database["public"]["Enums"]["judge_level"]
          languages: string[] | null
          specialties: string[] | null
          total_points: number | null
          total_questions_answered: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          average_response_time?: unknown | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          judge_level: Database["public"]["Enums"]["judge_level"]
          languages?: string[] | null
          specialties?: string[] | null
          total_points?: number | null
          total_questions_answered?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_rating?: number | null
          average_response_time?: unknown | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          id?: string
          is_available?: boolean | null
          judge_level?: Database["public"]["Enums"]["judge_level"]
          languages?: string[] | null
          specialties?: string[] | null
          total_points?: number | null
          total_questions_answered?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "judge_info_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          id: string
          image_url: string | null
          message_type: Database["public"]["Enums"]["message_type"]
          metadata: Json | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          message_type?: Database["public"]["Enums"]["message_type"]
          metadata?: Json | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          data: Json | null
          id: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          data?: Json | null
          id?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_online: boolean | null
          last_seen: string | null
          notification_preferences: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_online?: boolean | null
          last_seen?: string | null
          notification_preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          notification_preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          assigned_at: string | null
          assigned_judge_id: string | null
          category: string
          completed_at: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          status: Database["public"]["Enums"]["question_status"]
          timeout_at: string
          title: string
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_judge_id?: string | null
          category: string
          completed_at?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          status?: Database["public"]["Enums"]["question_status"]
          timeout_at?: string
          title: string
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_judge_id?: string | null
          category?: string
          completed_at?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          status?: Database["public"]["Enums"]["question_status"]
          timeout_at?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_assigned_judge_id_fkey"
            columns: ["assigned_judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ratings: {
        Row: {
          conversation_id: string
          created_at: string
          feedback: string | null
          id: string
          is_accepted: boolean
          judge_id: string
          rating: number
          user_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_accepted: boolean
          judge_id: string
          rating: number
          user_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          feedback?: string | null
          id?: string
          is_accepted?: boolean
          judge_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          judge_id: string
          points_earned: number
          reason: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          judge_id: string
          points_earned: number
          reason: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          judge_id?: string
          points_earned?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "rewards_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_judge_id_fkey"
            columns: ["judge_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      conversation_status: "active" | "disputed" | "ended"
      dispute_status: "pending" | "resolved" | "under_review"
      judge_level: "L1" | "L2" | "L3"
      message_type: "image" | "system" | "text"
      question_status:
        | "assigned"
        | "completed"
        | "disputed"
        | "in_progress"
        | "resolved"
        | "waiting_for_judge"
      user_role: "admin" | "judge" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never