"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, Loader2, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Appointment, Service } from "@/lib/supabase/types";
import CitasPanel from "./CitasPanel";
import ServiciosPanel from "./ServiciosPanel";

export default function AdminDashboard({
  email,
  isAdmin,
  initialServices,
  initialAppointments,
}: {
  email: string;
  isAdmin: boolean;
  initialServices: Service[];
  initialAppointments: Appointment[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"citas" | "servicios">("citas");
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleClaimAdmin() {
    setClaiming(true);
    setClaimError(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("claim_admin");
    setClaiming(false);

    if (error) {
      setClaimError("Ocurrió un error. Intenta de nuevo.");
      return;
    }
    if (!data) {
      setClaimError("Ya existe un administrador para esta barbería.");
      return;
    }
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border-soft px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-gt.png"
            alt="Golden Touch"
            width={36}
            height={36}
            className="h-8 w-8 object-contain"
          />
          <div>
            <p className="font-serif text-lg text-foreground">Panel de administración</p>
            <p className="text-xs text-foreground/45">{email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-full border border-border-soft px-4 py-2 text-xs uppercase tracking-widest text-foreground/60 transition hover:border-gold hover:text-gold-light"
        >
          <LogOut size={14} />
          Salir
        </button>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12 md:px-10">
        {!isAdmin ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-md rounded-2xl border border-gold/40 bg-background-card p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 text-gold">
              <Crown size={24} />
            </div>
            <h2 className="font-serif text-2xl text-foreground">Configura tu acceso</h2>
            <p className="mt-3 text-sm text-foreground/60">
              Esta cuenta todavía no administra la barbería. Si eres el dueño y esta es la
              primera cuenta que se crea, conviértete en administrador para ver y gestionar las
              citas y los servicios.
            </p>
            {claimError && <p className="mt-3 text-sm text-red-400">{claimError}</p>}
            <button
              onClick={handleClaimAdmin}
              disabled={claiming}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm uppercase tracking-widest text-background transition hover:bg-gold-light disabled:opacity-60"
            >
              {claiming && <Loader2 className="animate-spin" size={16} />}
              Convertirme en admin
            </button>
          </motion.div>
        ) : (
          <>
            <div className="mb-8 flex gap-2 rounded-full border border-border-soft p-1 text-sm w-fit">
              <button
                onClick={() => setTab("citas")}
                className={`rounded-full px-5 py-2 uppercase tracking-widest transition ${
                  tab === "citas" ? "bg-gold text-background" : "text-foreground/60"
                }`}
              >
                Citas
              </button>
              <button
                onClick={() => setTab("servicios")}
                className={`rounded-full px-5 py-2 uppercase tracking-widest transition ${
                  tab === "servicios" ? "bg-gold text-background" : "text-foreground/60"
                }`}
              >
                Servicios
              </button>
            </div>

            {tab === "citas" ? (
              <CitasPanel initialAppointments={initialAppointments} services={initialServices} />
            ) : (
              <ServiciosPanel initialServices={initialServices} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
