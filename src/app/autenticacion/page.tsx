import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AuthForm from "./AuthForm";

export default function AutenticacionPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md rounded-2xl border border-border-soft bg-background-card p-8">
          <h1 className="font-serif text-2xl text-foreground">Conecta Supabase</h1>
          <p className="mt-3 text-sm text-foreground/60">
            Agrega <code className="text-gold-light">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
            <code className="text-gold-light">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en tu archivo{" "}
            <code className="text-gold-light">.env.local</code> para activar el inicio de sesión.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-5 py-24">
      <Link href="/" className="flex flex-col items-center gap-3">
        <Image
          src="/logo-gt.png"
          alt="Golden Touch Barber & Style"
          width={72}
          height={72}
          className="h-16 w-16 object-contain"
        />
        <span className="font-serif text-2xl text-foreground">Golden Touch</span>
      </Link>

      <Suspense fallback={null}>
        <AuthForm />
      </Suspense>

      <Link
        href="/"
        className="text-xs uppercase tracking-widest text-foreground/40 transition hover:text-gold-light"
      >
        Volver al sitio
      </Link>
    </main>
  );
}
