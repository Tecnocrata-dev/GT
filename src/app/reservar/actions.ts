"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface CreateAppointmentInput {
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  name: string;
  phone: string;
  notes: string;
}

export interface CreateAppointmentResult {
  success: boolean;
  error?: string;
}

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<CreateAppointmentResult> {
  const name = input.name.trim();
  const phone = input.phone.trim();

  if (!input.serviceId || !input.date || !input.time) {
    return { success: false, error: "Selecciona servicio, fecha y hora." };
  }
  if (name.length < 2) {
    return { success: false, error: "Escribe tu nombre completo." };
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return { success: false, error: "Escribe un número de teléfono válido a 10 dígitos." };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "La barbería todavía no conecta su base de datos. Escríbenos por WhatsApp para agendar.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("appointments").insert({
    service_id: input.serviceId,
    customer_name: name,
    customer_phone: phone,
    appointment_date: input.date,
    appointment_time: input.time,
    notes: input.notes.trim(),
  });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        error: "Ese horario se acaba de reservar. Por favor elige otro.",
      };
    }
    return { success: false, error: "No se pudo crear la reserva. Intenta de nuevo." };
  }

  return { success: true };
}
