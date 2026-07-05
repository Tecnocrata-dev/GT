"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, Loader2, MessageCircle, Scissors } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  dateKey,
  getAvailableSlots,
  getBookableDays,
  timeToMinutes,
} from "@/lib/booking";
import { whatsappUrl } from "@/lib/site";
import type { Service } from "@/lib/supabase/types";
import { createAppointment } from "./actions";

const STEPS = ["Servicio", "Fecha", "Hora", "Tus datos"];

const peso = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function BookingFlow({ services }: { services: Service[] }) {
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const service = useMemo(
    () => services.find((s) => s.id === serviceId) ?? null,
    [services, serviceId]
  );
  const days = useMemo(() => getBookableDays(30), []);

  const offlineSlots = useMemo(() => {
    if (!service || !selectedDate || isSupabaseConfigured()) return null;
    return getAvailableSlots(selectedDate, service.duration_minutes, []);
  }, [service, selectedDate]);

  useEffect(() => {
    if (!service || !selectedDate || !isSupabaseConfigured()) return;
    const currentService = service;
    const currentDate = selectedDate;

    let active = true;
    const supabase = createClient();
    const key = dateKey(currentDate);

    async function loadSlots() {
      setSlotsLoading(true);
      const { data } = await supabase
        .from("booked_slots_public")
        .select("service_id, appointment_date, appointment_time")
        .eq("appointment_date", key);

      if (!active) return;

      const bookedRanges = (data ?? []).map((row) => {
        const bookedService = services.find((s) => s.id === row.service_id);
        const start = timeToMinutes(row.appointment_time.slice(0, 5));
        const duration = bookedService?.duration_minutes ?? 30;
        return { startMinutes: start, endMinutes: start + duration };
      });

      setSlots(getAvailableSlots(currentDate, currentService.duration_minutes, bookedRanges));
      setSlotsLoading(false);
    }

    loadSlots();

    const channel = supabase
      .channel(`booked-slots-${key}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "booked_slots_public",
          filter: `appointment_date=eq.${key}`,
        },
        () => loadSlots()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [service, selectedDate, services]);

  function goTo(n: number) {
    setError(null);
    setStep(n);
  }

  function handleSubmit() {
    if (!service || !selectedDate || !time) return;
    setError(null);

    startTransition(async () => {
      const result = await createAppointment({
        serviceId: service.id,
        date: dateKey(selectedDate),
        time,
        name,
        phone,
        notes,
      });

      if (!result.success) {
        setError(result.error ?? "No se pudo completar la reserva.");
        return;
      }
      setSuccess(true);
    });
  }

  if (success && service && selectedDate && time) {
    const message = [
      `Hola, acabo de reservar una cita en Golden Touch Barber & Style.`,
      `Servicio: ${service.name}`,
      `Fecha: ${selectedDate.toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })}`,
      `Hora: ${time}`,
      `Nombre: ${name}`,
      `Quedo al pendiente de la confirmación. ¡Gracias!`,
    ].join("\n");

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gold/40 bg-background-card p-10 text-center"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 text-gold">
          <Check size={28} />
        </div>
        <h2 className="font-serif text-3xl text-foreground">¡Reserva recibida!</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-foreground/65">
          Tu cita para <span className="text-gold-light">{service.name}</span> quedó agendada
          el {selectedDate.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })} a las {time}.
          Confírmala con nosotros por WhatsApp para dejarla lista.
        </p>
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm uppercase tracking-widest text-background transition hover:bg-gold-light"
        >
          <MessageCircle size={18} />
          Confirmar por WhatsApp
        </a>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition ${
                  done
                    ? "border-gold bg-gold text-background"
                    : active
                      ? "border-gold text-gold-light"
                      : "border-border-soft text-foreground/40"
                }`}
              >
                {done ? <Check size={16} /> : n}
              </div>
              <span
                className={`hidden text-[11px] uppercase tracking-widest sm:block ${
                  active ? "text-gold-light" : "text-foreground/40"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setServiceId(s.id);
                  goTo(2);
                }}
                className={`flex flex-col items-start rounded-2xl border p-5 text-left transition ${
                  serviceId === s.id
                    ? "border-gold bg-gold/10"
                    : "border-border-soft bg-background-card hover:border-gold/50"
                }`}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Scissors size={16} />
                </div>
                <h3 className="font-serif text-xl text-foreground">{s.name}</h3>
                <p className="mt-1 text-xs text-foreground/55">{s.description}</p>
                <div className="mt-4 flex w-full items-center justify-between text-sm">
                  <span className="gold-text font-serif text-lg">{peso.format(s.price_mxn)}</span>
                  <span className="text-foreground/50">{s.duration_minutes} min</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <BackButton onClick={() => goTo(1)} />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {days.map((d) => {
                const active = selectedDate && dateKey(selectedDate) === dateKey(d);
                return (
                  <button
                    key={dateKey(d)}
                    onClick={() => {
                      setSelectedDate(d);
                      setTime(null);
                      goTo(3);
                    }}
                    className={`rounded-xl border px-3 py-4 text-center transition ${
                      active
                        ? "border-gold bg-gold/10"
                        : "border-border-soft bg-background-card hover:border-gold/50"
                    }`}
                  >
                    <div className="text-[11px] uppercase tracking-widest text-foreground/50">
                      {d.toLocaleDateString("es-MX", { weekday: "short" })}
                    </div>
                    <div className="mt-1 font-serif text-2xl text-foreground">{d.getDate()}</div>
                    <div className="text-[11px] text-foreground/40">
                      {d.toLocaleDateString("es-MX", { month: "short" })}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <BackButton onClick={() => goTo(2)} />
            {offlineSlots === null && slotsLoading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-foreground/50">
                <Loader2 className="animate-spin" size={18} />
                Buscando horarios disponibles…
              </div>
            ) : (offlineSlots ?? slots).length === 0 ? (
              <div className="rounded-2xl border border-border-soft bg-background-card p-10 text-center text-sm text-foreground/60">
                No hay horarios disponibles ese día. Elige otra fecha.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {(offlineSlots ?? slots).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setTime(s);
                      goTo(4);
                    }}
                    className={`rounded-xl border px-3 py-3 text-center font-serif text-lg transition ${
                      time === s
                        ? "border-gold bg-gold/10 text-gold-light"
                        : "border-border-soft bg-background-card text-foreground hover:border-gold/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === 4 && service && selectedDate && time && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <BackButton onClick={() => goTo(3)} />

            <div className="mb-6 rounded-2xl border border-border-soft bg-background-card p-5 text-sm text-foreground/70">
              <p>
                <span className="text-gold-light">{service.name}</span> ·{" "}
                {peso.format(service.price_mxn)} · {service.duration_minutes} min
              </p>
              <p className="mt-1">
                {selectedDate.toLocaleDateString("es-MX", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                a las {time}
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="flex flex-col gap-4"
            >
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                className="rounded-xl border border-border-soft bg-background-card px-4 py-3 text-foreground outline-none transition focus:border-gold"
              />
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Teléfono (WhatsApp)"
                type="tel"
                className="rounded-xl border border-border-soft bg-background-card px-4 py-3 text-foreground outline-none transition focus:border-gold"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas (opcional)"
                rows={3}
                className="resize-none rounded-xl border border-border-soft bg-background-card px-4 py-3 text-foreground outline-none transition focus:border-gold"
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm uppercase tracking-widest text-background transition hover:bg-gold-light disabled:opacity-60"
              >
                {isPending && <Loader2 className="animate-spin" size={16} />}
                Confirmar reserva
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-5 flex items-center gap-1 text-xs uppercase tracking-widest text-foreground/50 transition hover:text-gold-light"
    >
      <ChevronLeft size={14} />
      Atrás
    </button>
  );
}
