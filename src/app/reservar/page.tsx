import Navbar from "@/components/Navbar";
import { getActiveServices } from "@/lib/get-services";
import BookingFlow from "./BookingFlow";

export default async function ReservarPage() {
  const services = await getActiveServices();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-20 pt-32 md:pt-40">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold-light/90">
              Golden Touch Barber &amp; Style
            </p>
            <h1 className="font-serif text-4xl text-foreground md:text-5xl">
              Reserva tu <span className="gold-text italic">cita</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-foreground/60">
              Disponibilidad en tiempo real. Elige tu servicio, fecha y hora en menos de un minuto.
            </p>
          </div>
          <BookingFlow services={services} />
        </div>
      </main>
    </>
  );
}
