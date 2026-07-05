import type { Service } from "@/lib/supabase/types";

// Se muestra únicamente si todavía no se conecta Supabase (variables de
// entorno vacías) o si la consulta falla, para que la landing nunca se
// vea rota durante la demo. En cuanto NEXT_PUBLIC_SUPABASE_URL /
// NEXT_PUBLIC_SUPABASE_ANON_KEY estén configuradas, se usan los datos
// reales de la tabla `services` (ver supabase/schema.sql).
export const FALLBACK_SERVICES: Service[] = [
  {
    id: "fallback-1",
    name: "Corte Clásico",
    description: "Corte a tijera y máquina, acabado con navaja.",
    price_mxn: 180,
    duration_minutes: 30,
    active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-2",
    name: "Corte + Barba",
    description: "Corte completo más arreglo y perfilado de barba.",
    price_mxn: 280,
    duration_minutes: 45,
    active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-3",
    name: "Afeitado Tradicional",
    description: "Afeitado con navaja, toalla caliente y aftershave.",
    price_mxn: 200,
    duration_minutes: 30,
    active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-4",
    name: "Diseño de Barba",
    description: "Perfilado, contorno y línea de barba.",
    price_mxn: 150,
    duration_minutes: 20,
    active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-5",
    name: "Corte Niño",
    description: "Corte para niños hasta 12 años.",
    price_mxn: 140,
    duration_minutes: 25,
    active: true,
    sort_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-6",
    name: "Paquete Golden Touch",
    description: "Corte, barba, afeitado de contorno y tratamiento facial.",
    price_mxn: 420,
    duration_minutes: 75,
    active: true,
    sort_order: 6,
    created_at: new Date().toISOString(),
  },
];
