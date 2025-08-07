import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Passw0rd!", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  const now = new Date();
  const startDate = new Date(now.setHours(9, 0, 0, 0)); // 9:00 AM today
  const slots = [];

  for (let day = 0; day < 7; day++) {
    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const startAt = new Date();
        startAt.setDate(startAt.getDate() + day);
        startAt.setHours(hour, min, 0, 0);
        const endAt = new Date(startAt.getTime() + 30 * 60000);

        slots.push({
          startAt,
          endAt,
        });
      }
    }
  }

  await prisma.slot.createMany({ data: slots });
  console.log("Seeded admin and slots");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
