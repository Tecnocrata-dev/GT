"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#productos", label: "Productos" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#ubicacion", label: "Ubicación" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur border-b border-border-soft"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/logo-gt.png"
            alt="Golden Touch Barber & Style"
            width={44}
            height={44}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="font-serif text-xl tracking-wide text-foreground">
            Golden Touch
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-widest text-foreground/80 transition hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/reservar"
            className="rounded-full border border-gold bg-gold/10 px-5 py-2 text-sm uppercase tracking-widest text-gold-light transition hover:bg-gold hover:text-background"
          >
            Reservar
          </Link>
        </div>

        <button
          aria-label="Abrir menú"
          className="text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border-soft bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm uppercase tracking-widest text-foreground/80 transition hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/reservar"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full border border-gold bg-gold/10 px-5 py-3 text-center text-sm uppercase tracking-widest text-gold-light"
              >
                Reservar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
