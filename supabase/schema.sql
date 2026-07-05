-- Golden Touch Barber & Style — esquema de base de datos
-- Ejecutar en el SQL Editor de Supabase (proyecto nuevo, sin datos previos)

-- ─────────────────────────────────────────────
-- 1. Perfiles (uno por usuario de auth.users)
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Los usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Los usuarios pueden crear su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Crea automáticamente un perfil (sin privilegios de admin) al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Convierte en admin a quien la llame, únicamente si todavía no existe
-- ningún administrador. Así la primera cuenta que la presione se
-- convierte en dueña del panel.
create or replace function public.claim_admin()
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  admin_exists boolean;
begin
  select exists(select 1 from public.profiles where is_admin = true) into admin_exists;

  if admin_exists then
    return false;
  end if;

  update public.profiles set is_admin = true where id = auth.uid();
  return true;
end;
$$;

-- ─────────────────────────────────────────────
-- 2. Servicios
-- ─────────────────────────────────────────────
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price_mxn integer not null,
  duration_minutes integer not null,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Cualquiera puede ver servicios activos"
  on public.services for select
  using (active = true);

create policy "Los admins ven todos los servicios"
  on public.services for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Los admins administran servicios"
  on public.services for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

insert into public.services (name, description, price_mxn, duration_minutes, sort_order) values
  ('Corte Clásico', 'Corte a tijera y máquina, acabado con navaja.', 180, 30, 1),
  ('Corte + Barba', 'Corte completo más arreglo y perfilado de barba.', 280, 45, 2),
  ('Afeitado Tradicional', 'Afeitado con navaja, toalla caliente y aftershave.', 200, 30, 3),
  ('Diseño de Barba', 'Perfilado, contorno y línea de barba.', 150, 20, 4),
  ('Corte Niño', 'Corte para niños hasta 12 años.', 140, 25, 5),
  ('Paquete Golden Touch', 'Corte, barba, afeitado de contorno y tratamiento facial.', 420, 75, 6)
on conflict do nothing;

-- ─────────────────────────────────────────────
-- 3. Citas
-- ─────────────────────────────────────────────
create type public.appointment_status as enum ('pending', 'confirmed', 'cancelled');

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id),
  customer_name text not null,
  customer_phone text not null,
  appointment_date date not null,
  appointment_time time not null,
  notes text not null default '',
  status public.appointment_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (appointment_date, appointment_time)
);

alter table public.appointments enable row level security;

-- Cualquier visitante puede crear una cita (siempre en estado "pending")
create policy "Cualquiera puede reservar una cita"
  on public.appointments for insert
  with check (status = 'pending');

-- Los admins ven, confirman y cancelan todas las citas
create policy "Los admins ven todas las citas"
  on public.appointments for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Los admins actualizan citas"
  on public.appointments for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Los admins eliminan citas"
  on public.appointments for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- ─────────────────────────────────────────────
-- 4. Horarios ocupados (espejo público, sin datos del cliente)
-- ─────────────────────────────────────────────
-- Supabase Realtime transmite cambios de tablas físicas respetando RLS
-- para el rol que escucha. Como `appointments` solo es legible por
-- admins, esta tabla espejo guarda nada más servicio/fecha/hora de las
-- citas activas, para que /reservar calcule disponibilidad en vivo sin
-- exponer nombre ni teléfono de ningún cliente.
create table if not exists public.booked_slots_public (
  appointment_id uuid primary key references public.appointments (id) on delete cascade,
  service_id uuid not null references public.services (id),
  appointment_date date not null,
  appointment_time time not null
);

alter table public.booked_slots_public enable row level security;

create policy "Cualquiera puede ver horarios ocupados"
  on public.booked_slots_public for select
  using (true);

grant select on public.booked_slots_public to anon, authenticated;

create or replace function public.sync_booked_slots_public()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if (tg_op = 'DELETE') then
    delete from public.booked_slots_public where appointment_id = old.id;
    return old;
  end if;

  if (new.status = 'cancelled') then
    delete from public.booked_slots_public where appointment_id = new.id;
  else
    insert into public.booked_slots_public (appointment_id, service_id, appointment_date, appointment_time)
    values (new.id, new.service_id, new.appointment_date, new.appointment_time)
    on conflict (appointment_id) do update
      set service_id = excluded.service_id,
          appointment_date = excluded.appointment_date,
          appointment_time = excluded.appointment_time;
  end if;

  return new;
end;
$$;

drop trigger if exists on_appointment_change on public.appointments;
create trigger on_appointment_change
  after insert or update or delete on public.appointments
  for each row execute procedure public.sync_booked_slots_public();

alter table public.services replica identity full;
alter table public.booked_slots_public replica identity full;
alter table public.appointments replica identity full;

-- Habilita Realtime:
--  - booked_slots_public / services: para que /reservar refleje disponibilidad y precios en vivo
--  - appointments: para que el panel de admin vea nuevas citas al instante (protegido por RLS)
alter publication supabase_realtime add table public.booked_slots_public;
alter publication supabase_realtime add table public.services;
alter publication supabase_realtime add table public.appointments;
