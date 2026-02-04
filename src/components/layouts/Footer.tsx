import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t border-copper-100 bg-warm-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Joana Savi"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-semibold text-teal-800">Joana Savi</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Radiestesia Terapêutica — Transformando vidas através do equilíbrio
              energético.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-teal-800">Links</h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/sobre"
                className="text-sm text-muted-foreground hover:text-copper-600 transition-colors"
              >
                Sobre
              </Link>
              <Link
                href="/servico"
                className="text-sm text-muted-foreground hover:text-copper-600 transition-colors"
              >
                Serviço
              </Link>
              <Link
                href="/contato"
                className="text-sm text-muted-foreground hover:text-copper-600 transition-colors"
              >
                Contato
              </Link>
              <Link
                href="/politica-cancelamento"
                className="text-sm text-muted-foreground hover:text-copper-600 transition-colors"
              >
                Política de Cancelamento
              </Link>
            </nav>
          </div>

          {/* Social / Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-teal-800">Contato</h3>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:contato@joanasavi.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-copper-600 transition-colors"
              >
                <Mail className="h-4 w-4" />
                contato@joanasavi.com
              </a>
              <a
                href="https://wa.me/5500000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-copper-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="https://instagram.com/joanasavi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-copper-600 transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @joanasavi
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-copper-100" />

        <div className="text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Joana Savi — Radiestesia Terapêutica. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
