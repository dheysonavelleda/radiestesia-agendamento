import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Heart,
  Shield,
  Gem,
  Video,
  Clock,
  CreditCard,
  QrCode,
  Quote,
  ArrowRight,
  Sun,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-warm-50 via-white to-teal-50">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <Sun className="absolute top-20 left-[10%] h-5 w-5 text-copper-200 animate-pulse" />
          <Star className="absolute top-32 right-[15%] h-4 w-4 text-teal-200 animate-pulse delay-300" />
          <Gem className="absolute bottom-20 left-[20%] h-6 w-6 text-copper-100 animate-pulse delay-700" />
          <Heart className="absolute bottom-32 right-[25%] h-4 w-4 text-copper-200 animate-pulse delay-500" />
          <Sun className="absolute top-40 right-[35%] h-3 w-3 text-copper-300 animate-pulse delay-200" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-32 text-center relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-100/80 px-4 py-1.5 mb-6">
            <Video className="h-3.5 w-3.5 text-teal-600" />
            <span className="text-xs font-medium text-teal-700">
              Sessões online via Google Meet
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-teal-900 leading-tight tracking-tight">
            Transforme sua energia,
            <br />
            <span className="bg-gradient-to-r from-copper-500 to-copper-700 bg-clip-text text-transparent">
              transforme sua vida
            </span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Sessões de Radiestesia Terapêutica para harmonização de chakras,
            aura e corpos sutis. Cuide da sua energia com acompanhamento
            profissional e amoroso.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/booking">
              <Button
                size="lg"
                className="bg-copper-600 hover:bg-copper-700 text-white shadow-lg shadow-copper-200 px-8"
              >
                Agendar Sessão
              </Button>
            </Link>
            <Link href="/servico">
              <Button variant="outline" size="lg" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                Saiba Mais
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Brief */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/joana-photo.jpg"
                  alt="Joana Savi - Radiestesia Terapêutica"
                  width={500}
                  height={625}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 flex h-16 w-16 items-center justify-center rounded-full bg-copper-500 shadow-lg">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-sm font-medium text-copper-600 uppercase tracking-wider">
                Sobre
              </span>
              <h2 className="text-3xl font-bold text-teal-900">
                Olá, eu sou a Joana
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Arquiteta de formação e terapeuta energética por vocação. Encontrei na
                Radiestesia Terapêutica uma forma de ajudar pessoas a se reconectarem
                com sua essência e transformarem suas vidas.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Com formação reconhecida pelo MEC, ofereço sessões completas que
                trabalham corpo, mente e espírito — harmonizando chakras, aura,
                corpos sutis e ambientes.
              </p>
              <Link href="/sobre">
                <Button variant="link" className="text-copper-600 px-0 mt-2">
                  Conheça minha história
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Highlight */}
      <section className="py-16 sm:py-20 bg-warm-100/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-copper-600 uppercase tracking-wider">
              Serviço
            </span>
            <h2 className="mt-2 text-3xl font-bold text-teal-900">
              O que a sessão inclui
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Uma sessão completa e abrangente para o seu equilíbrio energético
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Chakras",
                desc: "Harmonização e equilíbrio dos centros energéticos",
              },
              {
                icon: Sun,
                title: "Aura",
                desc: "Limpeza e fortalecimento do campo áurico",
              },
              {
                icon: Shield,
                title: "Corpos Sutis",
                desc: "Alinhamento dos corpos energéticos",
              },
              {
                icon: Gem,
                title: "Ambientes",
                desc: "Harmonização energética de espaços",
              },
            ].map((item) => (
              <Card key={item.title} className="border-copper-100 hover:shadow-md transition-shadow">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                    <item.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-teal-800">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-copper-500" />
              <span>2 horas de duração</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-copper-500" />
              <span>Online via Google Meet</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-copper-600 uppercase tracking-wider">
              Investimento
            </span>
            <h2 className="mt-2 text-3xl font-bold text-teal-900">
              Invista em você
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* PIX */}
            <Card className="border-copper-200 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-copper-500 to-teal-500" />
              <CardContent className="pt-8 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-copper-100">
                  <QrCode className="h-6 w-6 text-copper-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-copper-600">PIX</p>
                  <p className="text-4xl font-bold text-teal-900 mt-1">
                    R$ 450
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pagamento em 2 etapas
                  </p>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 text-left bg-warm-100/50 rounded-lg p-3">
                  <p>✓ R$ 100 na reserva</p>
                  <p>✓ R$ 350 antes da sessão</p>
                </div>
                <Link href="/booking" className="block">
                  <Button className="w-full bg-copper-600 hover:bg-copper-700">
                    Agendar com PIX
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Card */}
            <Card className="border-copper-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                  <CreditCard className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-600">Cartão</p>
                  <p className="text-4xl font-bold text-teal-900 mt-1">
                    R$ 500
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Em até 4x de R$ 125
                  </p>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 text-left bg-warm-100/50 rounded-lg p-3">
                  <p>✓ Pagamento único no agendamento</p>
                  <p>✓ Parcelamento em até 4x</p>
                </div>
                <Link href="/booking" className="block">
                  <Button variant="outline" className="w-full border-teal-200 text-teal-700 hover:bg-teal-50">
                    Agendar com Cartão
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-warm-100/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-medium text-copper-600 uppercase tracking-wider">
              Depoimentos
            </span>
            <h2 className="mt-2 text-3xl font-bold text-teal-900">
              O que dizem sobre as sessões
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                name: "Maria C.",
                text: "A sessão com a Joana foi transformadora. Senti uma leveza que não sentia há anos. Recomendo de coração!",
              },
              {
                name: "Ana P.",
                text: "Profissional incrível! A forma como ela conduz a sessão é muito acolhedora e os resultados são reais.",
              },
              {
                name: "Carla R.",
                text: "Depois da harmonização, minha casa mudou de energia. Agradeço muito pelo trabalho maravilhoso da Joana.",
              },
            ].map((testimonial) => (
              <Card key={testimonial.name} className="border-copper-100">
                <CardContent className="pt-6 space-y-4">
                  <Quote className="h-8 w-8 text-copper-200" />
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-copper-50">
                    <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-xs font-semibold text-teal-600">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-teal-800">
                      {testimonial.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 p-10 sm:p-14 text-white shadow-xl shadow-teal-200">
            <Image
              src="/logo.png"
              alt="Joana Savi"
              width={48}
              height={48}
              className="mx-auto mb-4 rounded-full opacity-90"
            />
            <h2 className="text-2xl sm:text-3xl font-bold">
              Pronta para sua jornada de cura?
            </h2>
            <p className="mt-3 text-teal-100 max-w-lg mx-auto">
              Dê o primeiro passo para uma vida mais equilibrada e harmoniosa.
              Sua transformação começa aqui.
            </p>
            <Link href="/booking" className="inline-block mt-6">
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-teal-50 shadow-lg px-8"
              >
                Agendar Minha Sessão
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
