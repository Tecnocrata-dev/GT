import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-border-soft bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center md:flex-row md:justify-between md:px-8 md:text-left">
        <p className="font-serif text-lg text-foreground/80">
          {SITE.fullName}
        </p>
        <p className="text-xs uppercase tracking-widest text-foreground/40">
          © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
        </p>
        <Link
          href="/autenticacion"
          className="text-xs uppercase tracking-widest text-foreground/30 transition hover:text-gold-light"
        >
          Acceso staff
        </Link>
      </div>
    </footer>
  );
}
