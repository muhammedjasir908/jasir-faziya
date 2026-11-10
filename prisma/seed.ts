import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = process.env.ADMIN_NAME?.trim() || "Family Admin";
  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding.");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (!existing) {
    await prisma.admin.create({ data: { email, name, passwordHash } });
    console.log(`Created admin ${email}`);
  } else {
    console.log(`Admin ${email} already exists. Password was left unchanged.`);
  }

  await prisma.event.upsert({
    where: { slug: "nikah" },
    update: {},
    create: {
      slug: "nikah",
      title: "Nikah",
      sortOrder: 1,
    },
  });
  await prisma.event.upsert({
    where: { slug: "reception" },
    update: {
      title: "Grand wedding reception",
      date: new Date(Date.UTC(2026, 11, 7)),
      timeLabel: "1:00 PM – 3:00 PM",
      venue: "Shadhi Mahal Auditorium",
      address: "Vadakara, Kozhikode",
      mapUrl: "https://maps.app.goo.gl/23qZYC4USpue6aLu7",
    },
    create: {
      slug: "reception",
      title: "Grand wedding reception",
      date: new Date(Date.UTC(2026, 11, 7)),
      timeLabel: "1:00 PM – 3:00 PM",
      venue: "Shadhi Mahal Auditorium",
      address: "Vadakara, Kozhikode",
      mapUrl: "https://maps.app.goo.gl/23qZYC4USpue6aLu7",
      sortOrder: 2,
    },
  });
  console.log("Nikah and Reception events are ready.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
