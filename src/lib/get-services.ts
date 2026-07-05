import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { FALLBACK_SERVICES } from "@/lib/fallback-services";
import type { Service } from "@/lib/supabase/types";

export async function getActiveServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) return FALLBACK_SERVICES;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return FALLBACK_SERVICES;
  return data as Service[];
}
