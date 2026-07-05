"use client";

import { motion } from "framer-motion";
import { Award, Clock, Sparkles } from "lucide-react";

const PUNTOS = [
  {
    icon: Award,
    title: "Maestría en el oficio",
    text: "Barberos formados en técnicas clásicas y tendencias actuales.",
  },
  {
    icon: Sparkles,
    title: "Experiencia premium",
    text: "Ambiente cuidado, herramientas de calidad y atención personalizada.",
  },
  {
    icon: Clock,
    title: "Tu tiempo importa",
    text: "Reserva en línea y llega directo a tu cita, sin esperas.",
  },
];

export default function SobreNosotros() {
  return (
    <section id="nosotros" className="relative overflow-hidden bg-background py-24 md:py-32">
      <div className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-gold/5 blur-[120px]" />
      <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-2 md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold-light/90">
            Sobre nosotros
          </p>
          <h2 className="font-serif text-4xl leading-tight text-foreground md:text-5xl">
            El toque dorado que
            <span className="block gold-text italic">tu estilo merece</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-foreground/70">
            En Golden Touch Barber &amp; Style fusionamos la tradición de la
            barbería clásica con un ambiente moderno y detallista. Cada corte
            es un ritual: precisión, cuidado y una atención pensada para que
            salgas con la mejor versión de ti mismo.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {PUNTOS.map((punto, i) => (
            <motion.div
              key={punto.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="flex gap-5 rounded-2xl border border-border-soft bg-background-card p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                <punto.icon size={20} />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">{punto.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground/60">{punto.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
