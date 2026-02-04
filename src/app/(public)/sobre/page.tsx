import Image from "next/image";
import {
  Heart,
  GraduationCap,
  Building2,
  Compass,
  Eye,
  Shield,
  Target,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-warm-50 via-white to-teal-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative order-2 md:order-1">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/joana-photo.jpg"
                  alt="Joana Savi - Terapeuta Energética"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 flex h-14 w-14 items-center justify-center rounded-full bg-copper-500 shadow-lg">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="space-y-5 order-1 md:order-2">
              <span className="text-sm font-medium text-copper-600 uppercase tracking-wider">
                Sobre Mim
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-teal-900">
                Da Arquitetura à cura energética
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Meu nome é Joana Savi. Sou arquiteta de formação, mas ao longo da minha
                jornada descobri um chamado ainda mais profundo: ajudar pessoas a
                reconstruírem seu equilíbrio energético e emocional.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A transição da arquitetura para a terapia energética foi natural —
                ambas lidam com harmonizar espaços. A diferença é que agora trabalho
                com os espaços internos de cada ser humano.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Minha formação em Radiestesia Terapêutica é reconhecida pelo MEC,
                e busco constantemente atualização e aprofundamento para oferecer
                o melhor acompanhamento às minhas clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-teal-900">Formação e Certificações</h2>
            <p className="mt-2 text-muted-foreground">
              Compromisso com seriedade e qualificação profissional
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="border-copper-100 text-center">
              <CardContent className="pt-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                  <Building2 className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-teal-800 text-sm">Arquitetura e Urbanismo</h3>
                <p className="text-xs text-muted-foreground">Graduação completa</p>
              </CardContent>
            </Card>
            <Card className="border-copper-100 text-center">
              <CardContent className="pt-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-copper-100">
                  <GraduationCap className="h-6 w-6 text-copper-600" />
                </div>
                <h3 className="font-semibold text-teal-800 text-sm">Radiestesia Terapêutica</h3>
                <p className="text-xs text-muted-foreground">Certificação reconhecida pelo MEC</p>
              </CardContent>
            </Card>
            <Card className="border-copper-100 text-center">
              <CardContent className="pt-6 space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                  <Compass className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-semibold text-teal-800 text-sm">Formação Continuada</h3>
                <p className="text-xs text-muted-foreground">Atualização constante em terapias energéticas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What is Radiestesia */}
      <section className="py-16 sm:py-20 bg-warm-100/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-sm font-medium text-copper-600 uppercase tracking-wider">
              Entenda
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-teal-900">
              O que é Radiestesia Terapêutica?
            </h2>
          </div>

          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              A Radiestesia é uma técnica milenar que utiliza instrumentos como pêndulos
              e gráficos para identificar e corrigir desequilíbrios energéticos.
              A palavra vem do latim <em>radius</em> (radiação) e do grego{" "}
              <em>aisthesis</em> (sensibilidade) — ou seja, a sensibilidade às radiações.
            </p>
            <p>
              Na abordagem terapêutica, utilizamos a radiestesia para mapear o campo
              energético da pessoa, identificando bloqueios, desequilíbrios e padrões
              que podem estar afetando sua saúde física, emocional e espiritual.
            </p>
            <p>
              A partir desse diagnóstico energético, são aplicadas técnicas de
              harmonização que trabalham os chakras, a aura, os corpos sutis e até
              mesmo a energia dos ambientes onde a pessoa vive e trabalha.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-teal-900">
              Minha Filosofia
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Eye,
                title: "Olhar Integral",
                desc: "Cada pessoa é um universo único. Trabalho com uma visão completa — corpo, mente, emoções e espírito.",
              },
              {
                icon: Heart,
                title: "Acolhimento",
                desc: "As sessões acontecem em um espaço seguro, amoroso e sem julgamentos. Você está acolhida.",
              },
              {
                icon: Target,
                title: "Empoderamento",
                desc: "Meu objetivo é que você se torne protagonista da sua própria cura e transformação.",
              },
              {
                icon: Shield,
                title: "Ética e Respeito",
                desc: "Atuo com seriedade profissional, respeitando os limites e o tempo de cada pessoa.",
              },
            ].map((item) => (
              <Card key={item.title} className="border-copper-100">
                <CardContent className="pt-6 space-y-3 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-copper-100">
                    <item.icon className="h-6 w-6 text-copper-600" />
                  </div>
                  <h3 className="font-semibold text-teal-800">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
