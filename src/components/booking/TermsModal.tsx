"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: () => void;
}

export default function TermsModal({ open, onOpenChange, onAccept }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-copper-600" />
            <DialogTitle className="text-teal-800">
              Termos e Condições
            </DialogTitle>
          </div>
          <DialogDescription>
            Leia atentamente os termos abaixo antes de confirmar seu agendamento.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm text-foreground leading-relaxed">
          <section>
            <h3 className="font-semibold text-teal-700 mb-2">
              1. Sobre o Serviço
            </h3>
            <p>
              A sessão de Radiestesia Terapêutica tem duração de aproximadamente
              2 horas e é realizada via Google Meet. O link da sessão será
              enviado por e-mail após a confirmação do pagamento.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-teal-700 mb-2">
              2. Política de Pagamento
            </h3>
            <div className="space-y-2">
              <p>
                <strong>PIX (R$ 450,00):</strong> O pagamento é realizado em duas
                etapas. Um sinal de R$ 150,00 é cobrado no momento do agendamento.
                O valor restante de R$ 300,00 deve ser pago até 1 hora antes do
                horário da sessão.
              </p>
              <p>
                <strong>Cartão de Crédito (R$ 500,00):</strong> Pagamento único,
                podendo ser parcelado em até 4x sem juros. A confirmação é
                imediata após a aprovação.
              </p>
              <p>
                Caso o segundo pagamento via PIX não seja realizado dentro do
                prazo, o agendamento poderá ser cancelado automaticamente.
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-teal-700 mb-2">
              3. Política de Cancelamento
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Cancelamento com mais de 48h de antecedência:</strong>{" "}
                Reembolso integral do valor pago.
              </p>
              <p>
                <strong>Cancelamento entre 24h e 48h de antecedência:</strong>{" "}
                Reembolso de 50% do valor pago.
              </p>
              <p>
                <strong>Cancelamento com menos de 24h de antecedência:</strong>{" "}
                Sem direito a reembolso.
              </p>
              <p>
                <strong>Não comparecimento (No-show):</strong> Sem direito a
                reembolso.
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-teal-700 mb-2">
              4. Remarcação
            </h3>
            <p>
              Cada agendamento permite até 2 remarcações gratuitas, desde que
              solicitadas com no mínimo 24h de antecedência. A nova data deve
              estar dentro da disponibilidade existente.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-teal-700 mb-2">
              5. Considerações Importantes
            </h3>
            <div className="space-y-2">
              <p>
                A Radiestesia Terapêutica é uma prática integrativa complementar
                e não substitui tratamento médico ou psicológico.
              </p>
              <p>
                As informações compartilhadas durante a sessão são tratadas com
                total sigilo e confidencialidade.
              </p>
            </div>
          </section>
        </div>

        <DialogFooter>
          {onAccept ? (
            <Button
              onClick={() => {
                onAccept();
                onOpenChange(false);
              }}
              className="bg-copper-600 hover:bg-copper-700"
            >
              Li e aceito os termos
            </Button>
          ) : (
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-copper-600 hover:bg-copper-700"
            >
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
