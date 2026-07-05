"use client";

import { motion } from "framer-motion";
import { AtSign, MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";

export default function Contacto() {
  return (
    <section id="contacto" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold-light/90">
            Hablemos
          </p>
          <h2 className="font-serif text-4xl text-foreground md:text-5xl">
            Contáctanos
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-foreground/65">
            ¿Dudas o quieres reservar directo? Escríbenos por WhatsApp o
            síguenos en Instagram.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-3"
        >
          <a
            href={whatsappUrl("Hola, me gustaría agendar una cita en Golden Touch Barber & Style.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-2xl border border-border-soft bg-background-card px-5 py-7 transition hover:border-gold/60"
          >
            <MessageCircle className="text-gold" size={24} />
            <span className="text-sm text-foreground/80">WhatsApp</span>
          </a>
          <a
            href={`tel:+${SITE.phoneE164}`}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border-soft bg-background-card px-5 py-7 transition hover:border-gold/60"
          >
            <Phone className="text-gold" size={24} />
            <span className="text-sm text-foreground/80">{SITE.phoneDisplay}</span>
          </a>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-2xl border border-border-soft bg-background-card px-5 py-7 transition hover:border-gold/60"
          >
            <AtSign className="text-gold" size={24} />
            <span className="text-sm text-foreground/80">{SITE.instagramHandle}</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-14 max-w-md rounded-2xl border border-border-soft bg-background-card p-6"
        >
          <h3 className="font-serif text-lg text-gold-light">Horario</h3>
          <ul className="mt-3 space-y-1.5 text-sm text-foreground/65">
            {SITE.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-6">
                <span>{h.day}</span>
                <span>{h.hours}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
