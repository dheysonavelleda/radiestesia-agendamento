import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar serviço padrão
  const service = await prisma.service.upsert({
    where: { id: "default-service" },
    update: {},
    create: {
      id: "default-service",
      name: "Sessão de Radiestesia Terapêutica",
      description:
        "Atendimento online de 2 horas via Google Meet. Harmonização de chakras, aura, corpos sutis e ambientes para mais leveza, clareza e conexão.",
      duration: 120,
      pricePix: 450.0,
      priceCard: 500.0,
      active: true,
    },
  });

  console.log("✅ Serviço criado:", service.name);

  // Criar admin (Joana)
  const admin = await prisma.user.upsert({
    where: { email: "joana@joanasavi.com" },
    update: {},
    create: {
      name: "Joana Stecanella Savi",
      email: "joana@joanasavi.com",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin criada:", admin.name);

  console.log("\n🌱 Seed completo!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
