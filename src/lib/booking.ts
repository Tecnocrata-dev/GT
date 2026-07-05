// Reglas de horario de negocio y cálculo de disponibilidad.
// day: 0 = domingo ... 6 = sábado (igual que Date.getDay())
export const BUSINESS_HOURS: Record<number, { open: string; close: string } | null> = {
  0: { open: "10:00", close: "17:00" }, // domingo
  1: null, // lunes cerrado
  2: { open: "10:00", close: "20:00" },
  3: { open: "10:00", close: "20:00" },
  4: { open: "10:00", close: "20:00" },
  5: { open: "10:00", close: "20:00" },
  6: { open: "09:00", close: "20:00" }, // sábado
};

export const SLOT_STEP_MINUTES = 30;
export const BOOKING_WINDOW_DAYS = 30;

export function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function dateKey(date: Date) {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getBookableDays(count: number = BOOKING_WINDOW_DAYS) {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let cursor = new Date(today);

  while (days.length < count) {
    if (BUSINESS_HOURS[cursor.getDay()]) {
      days.push(new Date(cursor));
    }
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
  }

  return days;
}

interface BookedRange {
  startMinutes: number;
  endMinutes: number;
}

/** Genera los horarios disponibles para una fecha y duración de servicio dados. */
export function getAvailableSlots(
  date: Date,
  durationMinutes: number,
  bookedRanges: BookedRange[]
): string[] {
  const hours = BUSINESS_HOURS[date.getDay()];
  if (!hours) return [];

  const openMinutes = timeToMinutes(hours.open);
  const closeMinutes = timeToMinutes(hours.close);
  const isToday = dateKey(date) === dateKey(new Date());
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: string[] = [];
  for (
    let start = openMinutes;
    start + durationMinutes <= closeMinutes;
    start += SLOT_STEP_MINUTES
  ) {
    if (isToday && start <= nowMinutes + 30) continue;

    const end = start + durationMinutes;
    const overlaps = bookedRanges.some(
      (range) => start < range.endMinutes && end > range.startMinutes
    );
    if (!overlaps) slots.push(minutesToTime(start));
  }

  return slots;
}
