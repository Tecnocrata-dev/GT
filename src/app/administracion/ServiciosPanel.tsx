"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Service } from "@/lib/supabase/types";

export default function ServiciosPanel({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  function updateLocal(id: string, patch: Partial<Service>) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function save(service: Service) {
    setSavingId(service.id);
    setSavedId(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("services")
      .update({
        price_mxn: service.price_mxn,
        duration_minutes: service.duration_minutes,
        active: service.active,
      })
      .eq("id", service.id);
    setSavingId(null);
    if (!error) {
      setSavedId(service.id);
      setTimeout(() => setSavedId(null), 1800);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {services.map((s) => (
        <div
          key={s.id}
          className="flex flex-col gap-4 rounded-2xl border border-border-soft bg-background-card p-5 md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0">
            <p className="font-serif text-lg text-foreground">{s.name}</p>
            <p className="mt-1 max-w-sm text-xs text-foreground/50">{s.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50">
              Precio
              <div className="flex items-center gap-1 rounded-lg border border-border-soft bg-background px-2 py-1.5">
                <span className="text-foreground/40">$</span>
                <input
                  type="number"
                  min={0}
                  value={s.price_mxn}
                  onChange={(e) => updateLocal(s.id, { price_mxn: Number(e.target.value) })}
                  className="w-16 bg-transparent text-foreground outline-none"
                />
              </div>
            </label>

            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50">
              Duración
              <div className="flex items-center gap-1 rounded-lg border border-border-soft bg-background px-2 py-1.5">
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={s.duration_minutes}
                  onChange={(e) => updateLocal(s.id, { duration_minutes: Number(e.target.value) })}
                  className="w-14 bg-transparent text-foreground outline-none"
                />
                <span className="text-foreground/40">min</span>
              </div>
            </label>

            <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50">
              <input
                type="checkbox"
                checked={s.active}
                onChange={(e) => updateLocal(s.id, { active: e.target.checked })}
                className="h-4 w-4 accent-[color:var(--gold)]"
              />
              Activo
            </label>

            <button
              onClick={() => save(s)}
              disabled={savingId === s.id}
              className="flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-xs uppercase tracking-widest text-background transition hover:bg-gold-light disabled:opacity-60"
            >
              {savingId === s.id ? (
                <Loader2 className="animate-spin" size={14} />
              ) : savedId === s.id ? (
                <Check size={14} />
              ) : null}
              Guardar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
