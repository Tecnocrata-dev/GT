"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const FOTOS = [
  {
    src: "/local/local-sillones.jpg",
    alt: "Estaciones de corte Golden Touch",
    clase: "col-span-2 aspect-[16/9]",
  },
  {
    src: "/local/local-pole.jpg",
    alt: "Poste de barbería",
    clase: "row-span-2 aspect-auto",
  },
  {
    src: "/local/local-interior.jpg",
    alt: "Interior de la barbería",
    clase: "aspect-[4/3]",
  },
  {
    src: "/local/local-billar.jpg",
    alt: "Mesa de billar y sillones",
    clase: "aspect-[4/3]",
  },
];

export default function Espacio() {
  return (
    <section id="espacio" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/local/local-billar.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold-light/90">
            Más que un corte
          </p>
          <h2 className="font-serif text-4xl text-foreground md:text-5xl">
            Nuestro <span className="gold-text italic">Espacio</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-foreground/60">
            Sillones clásicos, espejos con luz perfecta y una mesa de billar
            para que la espera también se disfrute.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {FOTOS.map((foto, i) => (
            <motion.div
              key={foto.src + i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border border-border-soft ${foto.clase}`}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/20 transition duration-300 group-hover:bg-transparent" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <Link
            href="/reservar"
            className="rounded-full border border-gold/60 px-9 py-3.5 text-sm uppercase tracking-widest text-gold-light transition hover:bg-gold hover:text-background"
          >
            Ven a conocernos
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
