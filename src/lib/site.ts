export const SITE = {
  name: "Golden Touch",
  fullName: "Golden Touch Barber & Style",
  address: "Blvd. Cucapah 437, Villafontana, Lomas del Matamoros, 22206 Tijuana, B.C.",
  phoneDisplay: "+52 664 701 6823",
  phoneE164: "526647016823",
  instagramUrl:
    "https://www.instagram.com/goldent_barberstyle?igsh=MXJndTE5dXhqOTBxcw==&utm_source=qr",
  instagramHandle: "@goldent_barberstyle",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=" +
    encodeURIComponent("Blvd. Cucapah 437, Villafontana, Lomas del Matamoros, 22206 Tijuana, BC") +
    "&t=&z=15&ie=UTF8&iwloc=&output=embed",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Blvd. Cucapah 437, Villafontana, Lomas del Matamoros, 22206 Tijuana, BC"),
  hours: [
    { day: "Lunes", hours: "Cerrado" },
    { day: "Martes a Viernes", hours: "10:00 am – 8:00 pm" },
    { day: "Sábado", hours: "9:00 am – 8:00 pm" },
    { day: "Domingo", hours: "10:00 am – 5:00 pm" },
  ],
} as const;

export function whatsappUrl(message: string, phone: string = SITE.phoneE164) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
