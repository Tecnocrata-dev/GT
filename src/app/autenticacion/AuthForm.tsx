"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/administracion";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError("Correo o contraseña incorrectos.");
        return;
      }
      router.push(next);
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message === "User already registered"
        ? "Ese correo ya tiene una cuenta. Inicia sesión."
        : "No se pudo crear la cuenta. Intenta de nuevo.");
      return;
    }

    if (data.session) {
      router.push(next);
      router.refresh();
    } else {
      setNotice("Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.");
      setMode("login");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-sm rounded-2xl border border-border-soft bg-background-card p-8"
    >
      <div className="mb-6 flex rounded-full border border-border-soft p-1 text-sm">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full py-2 uppercase tracking-widest transition ${
            mode === "login" ? "bg-gold text-background" : "text-foreground/60"
          }`}
        >
          Entrar
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full py-2 uppercase tracking-widest transition ${
            mode === "signup" ? "bg-gold text-background" : "text-foreground/60"
          }`}
        >
          Crear cuenta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3">
          <Mail size={16} className="text-foreground/40" />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            className="w-full bg-transparent text-foreground outline-none"
          />
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3">
          <Lock size={16} className="text-foreground/40" />
          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full bg-transparent text-foreground outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {notice && <p className="text-sm text-gold-light">{notice}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm uppercase tracking-widest text-background transition hover:bg-gold-light disabled:opacity-60"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </form>
    </motion.div>
  );
}
