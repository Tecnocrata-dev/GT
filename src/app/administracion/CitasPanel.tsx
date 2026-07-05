"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Phone, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Appointment, AppointmentStatus, Service } from "@/lib/supabase/types";

const peso = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  pending: "border-gold/50 text-gold-light",
  confirmed: "border-emerald-500/50 text-emerald-400",
  cancelled: "border-red-500/40 text-red-400",
};

export default function CitasPanel({
  initialAppointments,
  services,
}: {
  initialAppointments: Appointment[];
  services: Service[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");

  const servicesById = useMemo(
    () => new Map(services.map((s) => [s.id, s])),
    [services]
  );

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-appointments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        async () => {
          const { data } = await supabase
            .from("appointments")
            .select("*")
            .order("appointment_date", { ascending: true })
            .order("appointment_time", { ascending: true });
          if (data) setAppointments(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateStatus(id: string, status: AppointmentStatus) {
    const supabase = createClient();
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    await supabase.from("appointments").update({ status }).eq("id", id);
  }

  const filtered = appointments.filter((a) => filter === "all" || a.status === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition ${
              filter === f
                ? "border-gold bg-gold/10 text-gold-light"
                : "border-border-soft text-foreground/50 hover:border-gold/40"
            }`}
          >
            {f === "all" ? "Todas" : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-border-soft bg-background-card p-10 text-center text-sm text-foreground/50">
          No hay citas para mostrar.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => {
            const service = servicesById.get(a.service_id);
            return (
              <div
                key={a.id}
                className="flex flex-col gap-4 rounded-2xl border border-border-soft bg-background-card p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-serif text-lg text-foreground">{a.customer_name}</p>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${STATUS_STYLE[a.status]}`}
                    >
                      {STATUS_LABEL[a.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/60">
                    {service?.name ?? "Servicio"} · {service ? peso.format(service.price_mxn) : ""}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/45">
                    <Phone size={12} />
                    {a.customer_phone}
                  </p>
                  {a.notes && (
                    <p className="mt-1 text-xs italic text-foreground/40">“{a.notes}”</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-serif text-lg text-gold-light">
                      {new Date(`${a.appointment_date}T00:00:00`).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-xs text-foreground/50">{a.appointment_time.slice(0, 5)}</p>
                  </div>
                  {a.status !== "confirmed" && (
                    <button
                      onClick={() => updateStatus(a.id, "confirmed")}
                      aria-label="Confirmar"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/50 text-emerald-400 transition hover:bg-emerald-500/10"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  {a.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(a.id, "cancelled")}
                      aria-label="Cancelar"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/40 text-red-400 transition hover:bg-red-500/10"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
