"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

export default function Mapa() {
  return (
    <section id="ubicacion" className="bg-background-soft py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold-light/90">
            Encuéntranos
          </p>
          <h2 className="font-serif text-4xl text-foreground md:text-5xl">
            Nuestra <span className="gold-text italic">Ubicación</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden rounded-2xl border border-border-soft"
        >
          <div className="flex flex-col gap-6 bg-background-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Golden Touch Barber &amp; Style</h3>
                <p className="mt-1 max-w-md text-sm text-foreground/65">{SITE.address}</p>
              </div>
            </div>
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-full border border-gold px-6 py-3 text-center text-sm uppercase tracking-widest text-gold-light transition hover:bg-gold hover:text-background"
            >
              Cómo llegar
            </a>
          </div>
          <iframe
            title="Ubicación de Golden Touch Barber & Style"
            src={SITE.mapsEmbedUrl}
            className="h-[420px] w-full grayscale-[15%]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
