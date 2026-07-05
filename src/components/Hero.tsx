"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/local/local-interior.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0908_85%)] opacity-70" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <Image
            src="/logo-gt.png"
            alt="Golden Touch Barber & Style"
            width={260}
            height={260}
            priority
            className="h-40 w-40 object-contain md:h-56 md:w-56"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-3 text-xs uppercase tracking-[0.4em] text-gold-light/90"
        >
          Tijuana, Baja California
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="font-serif text-5xl leading-[1.05] text-foreground md:text-7xl"
        >
          Golden Touch
          <span className="block gold-text italic">Barber &amp; Style</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-6 max-w-md text-base text-foreground/70 md:text-lg"
        >
          Cortes clásicos, barbas perfiladas y una experiencia hecha a la
          medida del caballero moderno.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/reservar"
            className="rounded-full bg-gold px-9 py-3.5 text-sm uppercase tracking-widest text-background transition hover:bg-gold-light"
          >
            Reservar cita
          </Link>
          <a
            href="#servicios"
            className="rounded-full border border-foreground/25 px-9 py-3.5 text-sm uppercase tracking-widest text-foreground/85 transition hover:border-gold hover:text-gold-light"
          >
            Ver servicios
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-9 w-[1px] bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
