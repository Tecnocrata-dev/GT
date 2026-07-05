export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

// Nota: se usan `type` (no `interface`) porque las tablas de Supabase
// necesitan satisfacer un índice `Record<string, unknown>`, y TypeScript
// no aplica esa firma implícita a los `interface`.
export type Service = {
  id: string;
  name: string;
  description: string;
  price_mxn: number;
  duration_minutes: number;
  active: boolean;
  sort_order: number;
  created_at: string;
};

export type Appointment = {
  id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  appointment_date: string;
  appointment_time: string;
  notes: string;
  status: AppointmentStatus;
  created_at: string;
};

export type BookedSlotPublic = {
  appointment_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
};

export type Profile = {
  id: string;
  email: string | null;
  is_admin: boolean;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      services: {
        Row: Service;
        Insert: Partial<Service> & { name: string; price_mxn: number; duration_minutes: number };
        Update: Partial<Service>;
        Relationships: [];
      };
      appointments: {
        Row: Appointment;
        Insert: Partial<Appointment> & {
          service_id: string;
          customer_name: string;
          customer_phone: string;
          appointment_date: string;
          appointment_time: string;
        };
        Update: Partial<Appointment>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      booked_slots_public: {
        Row: BookedSlotPublic;
        Insert: BookedSlotPublic;
        Update: Partial<BookedSlotPublic>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      claim_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
};
