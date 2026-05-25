import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing from .env");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding CeylonPrivé database...");

  const rawPassword =
    process.env.INITIAL_ADMIN_PASSWORD ?? "Admin@CeylonPrive2025!";
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ceylonprive.com" },
    update: {},
    create: {
      email: "admin@ceylonprive.com",
      passwordHash,
      name: "CeylonPrivé Guide",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user ready:", admin.email);
  console.log("⚠️  Change the password after first login!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
