"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

export default function WhatsAppFloat() {
  return (
    <motion.a
      href={whatsappUrl("Hola, me gustaría agendar una cita en Golden Touch Barber & Style.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.8 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-background shadow-[0_6px_24px_-6px_rgba(201,162,39,0.6)]"
    >
      <MessageCircle size={26} />
    </motion.a>
  );
}
