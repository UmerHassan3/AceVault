import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error(
      'Usage: npm run create-admin -- "email@example.com" "password"'
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    try {
      process.loadEnvFile(".env.local");
    } catch {
      // ignore; env vars may already be supplied by the environment
    }
  }

  // Build a standalone connection here instead of importing "@/db" — that
  // module pulls in the "server-only" package, which always throws when
  // required outside of Next's bundler (i.e. when run directly via tsx).
  const { neon } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-http");
  const schema = await import("../db/schema");

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });
  const { users } = schema;

  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    await db.update(users).set({ passwordHash }).where(eq(users.email, email));
    console.log(`Updated password for existing admin user: ${email}`);
  } else {
    await db.insert(users).values({ email, passwordHash });
    console.log(`Created admin user: ${email}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
