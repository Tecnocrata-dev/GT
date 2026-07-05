"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const PRODUCTOS = [
  {
    nombre: "Polvo Texturizador",
    marca: "L3VEL3",
    descripcion: "Volumen instantáneo y acabado mate con fijación fuerte.",
    imagen: "/productos/producto-polvo.jpg",
  },
  {
    nombre: "Crema Brillante",
    marca: "L3VEL3",
    descripcion: "Peinado flexible con brillo natural para el día a día.",
    imagen: "/productos/producto-crema.jpg",
  },
  {
    nombre: "Gel Vitaminado",
    marca: "Elegance",
    descripcion: "Fijación extra fuerte enriquecida con vitamina B5.",
    imagen: "/productos/producto-gel.jpg",
  },
  {
    nombre: "Aceite para Barba",
    marca: "L3VEL3",
    descripcion: "Con aceite de argán: suaviza, fortalece y controla el frizz.",
    imagen: "/productos/producto-aceite.jpg",
  },
];

export default function Productos() {
  return (
    <section id="productos" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold-light/90">
            Llévate el estilo a casa
          </p>
          <h2 className="font-serif text-4xl text-foreground md:text-5xl">
            Nuestros <span className="gold-text italic">Productos</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-foreground/60">
            Selección profesional disponible en la barbería. Pregunta a tu
            barbero cuál va mejor con tu estilo.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTOS.map((producto, i) => (
            <motion.div
              key={producto.nombre}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-border-soft bg-background-card transition duration-300 hover:border-gold/60 hover:shadow-[0_0_40px_-12px_rgba(201,162,39,0.35)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={producto.imagen}
                  alt={`${producto.nombre} ${producto.marca}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-transparent" />
              </div>
              <div className="p-5 pt-2">
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold-light/80">
                  {producto.marca}
                </p>
                <h3 className="mt-1 font-serif text-xl text-foreground">
                  {producto.nombre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {producto.descripcion}
                </p>
                <p className="mt-4 border-t border-border-soft pt-3 text-xs uppercase tracking-widest text-foreground/50">
                  Disponible en barbería
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
