import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import Productos from "@/components/Productos";
import Espacio from "@/components/Espacio";
import SobreNosotros from "@/components/SobreNosotros";
import Mapa from "@/components/Mapa";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getActiveServices } from "@/lib/get-services";

export default async function Home() {
  const services = await getActiveServices();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Servicios services={services} />
        <Productos />
        <SobreNosotros />
        <Espacio />
        <Mapa />
        <Contacto />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
