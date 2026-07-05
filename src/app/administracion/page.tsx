import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminDashboard from "./AdminDashboard";

export default async function AdministracionPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md rounded-2xl border border-border-soft bg-background-card p-8">
          <h1 className="font-serif text-2xl text-foreground">Conecta Supabase</h1>
          <p className="mt-3 text-sm text-foreground/60">
            Agrega <code className="text-gold-light">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
            <code className="text-gold-light">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en tu archivo{" "}
            <code className="text-gold-light">.env.local</code> para activar el panel de
            administración.
          </p>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/autenticacion?next=/administracion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = Boolean(profile?.is_admin);

  const { data: services } = isAdmin
    ? await supabase.from("services").select("*").order("sort_order", { ascending: true })
    : { data: [] };

  const { data: appointments } = isAdmin
    ? await supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })
    : { data: [] };

  return (
    <AdminDashboard
      email={user.email ?? ""}
      isAdmin={isAdmin}
      initialServices={services ?? []}
      initialAppointments={appointments ?? []}
    />
  );
}
