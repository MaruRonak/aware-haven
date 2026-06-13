export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_alerts: {
        Row: {
          ai_response: Json | null
          alert_type: string
          created_at: string
          description: string | null
          id: string
          input_text: string | null
          is_resolved: boolean
          severity: Database["public"]["Enums"]["alert_severity"]
          user_id: string
        }
        Insert: {
          ai_response?: Json | null
          alert_type: string
          created_at?: string
          description?: string | null
          id?: string
          input_text?: string | null
          is_resolved?: boolean
          severity?: Database["public"]["Enums"]["alert_severity"]
          user_id: string
        }
        Update: {
          ai_response?: Json | null
          alert_type?: string
          created_at?: string
          description?: string | null
          id?: string
          input_text?: string | null
          is_resolved?: boolean
          severity?: Database["public"]["Enums"]["alert_severity"]
          user_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          name: string
          phone: string
          relation: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          name: string
          phone: string
          relation?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          name?: string
          phone?: string
          relation?: string | null
          user_id?: string
        }
        Relationships: []
      }
      incident_reports: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["incident_category"]
          created_at: string
          description: string | null
          evidence_url: string | null
          id: string
          is_anonymous: boolean
          latitude: number | null
          longitude: number | null
          occurred_at: string
          status: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          category?: Database["public"]["Enums"]["incident_category"]
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          id?: string
          is_anonymous?: boolean
          latitude?: number | null
          longitude?: number | null
          occurred_at?: string
          status?: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["incident_category"]
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          id?: string
          is_anonymous?: boolean
          latitude?: number | null
          longitude?: number | null
          occurred_at?: string
          status?: Database["public"]["Enums"]["incident_status"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      location_history: {
        Row: {
          accuracy_meters: number | null
          battery_level: number | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          recorded_at: string
          speed: number | null
          user_id: string
        }
        Insert: {
          accuracy_meters?: number | null
          battery_level?: number | null
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          recorded_at?: string
          speed?: number | null
          user_id: string
        }
        Update: {
          accuracy_meters?: number | null
          battery_level?: number | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          recorded_at?: string
          speed?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          language: string
          location_enabled: boolean
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          safety_score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          language?: string
          location_enabled?: boolean
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          safety_score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          language?: string
          location_enabled?: boolean
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          safety_score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_scores: {
        Row: {
          created_at: string
          id: string
          score: number
          topic: string | null
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          score: number
          topic?: string | null
          total: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          score?: number
          topic?: string | null
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      safe_zones: {
        Row: {
          address: string | null
          created_at: string
          id: string
          label: string
          latitude: number
          longitude: number
          radius_meters: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          label: string
          latitude: number
          longitude: number
          radius_meters?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          label?: string
          latitude?: number
          longitude?: number
          radius_meters?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sos_alerts: {
        Row: {
          address: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["sos_status"]
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["sos_status"]
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["sos_status"]
          user_id?: string
        }
        Relationships: []
      }
      trusted_circle: {
        Row: {
          can_track_location: boolean
          created_at: string
          email: string | null
          id: string
          name: string
          notify_on_sos: boolean
          phone: string
          relation: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          can_track_location?: boolean
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notify_on_sos?: boolean
          phone: string
          relation?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          can_track_location?: boolean
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notify_on_sos?: boolean
          phone?: string
          relation?: string | null
          updated_at?: string
          user_id?: string
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
      alert_severity: "low" | "medium" | "high" | "critical"
      incident_category:
        | "harassment"
        | "stalking"
        | "theft"
        | "assault"
        | "cyber"
        | "suspicious"
        | "other"
      incident_status: "open" | "investigating" | "resolved" | "closed"
      sos_status: "active" | "resolved"
      user_role: "woman" | "parent" | "senior" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["low", "medium", "high", "critical"],
      incident_category: [
        "harassment",
        "stalking",
        "theft",
        "assault",
        "cyber",
        "suspicious",
        "other",
      ],
      incident_status: ["open", "investigating", "resolved", "closed"],
      sos_status: ["active", "resolved"],
      user_role: ["woman", "parent", "senior", "admin"],
    },
  },
} as const
