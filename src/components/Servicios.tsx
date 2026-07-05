"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Scissors } from "lucide-react";
import type { Service } from "@/lib/supabase/types";

const peso = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function Servicios({ services }: { services: Service[] }) {
  return (
    <section id="servicios" className="bg-background-soft py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold-light/90">
            Lo que ofrecemos
          </p>
          <h2 className="font-serif text-4xl text-foreground md:text-5xl">
            Nuestros <span className="gold-text italic">Servicios</span>
          </h2>
        </motion.div>

        {services.length === 0 ? (
          <p className="text-center text-foreground/60">
            Muy pronto publicaremos nuestra lista de servicios.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.12 }}
                className="group rounded-2xl border border-border-soft bg-background-card p-7 transition duration-300 hover:border-gold/60 hover:shadow-[0_0_40px_-12px_rgba(201,162,39,0.35)]"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold transition group-hover:bg-gold group-hover:text-background">
                  <Scissors size={18} />
                </div>
                <h3 className="font-serif text-2xl text-foreground">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-border-soft pt-4">
                  <span className="font-serif text-2xl gold-text">
                    {peso.format(service.price_mxn)}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-foreground/50">
                    {service.duration_minutes} min
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <Link
            href="/reservar"
            className="rounded-full bg-gold px-9 py-3.5 text-sm uppercase tracking-widest text-background transition hover:bg-gold-light"
          >
            Agenda tu cita
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
