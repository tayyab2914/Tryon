import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 reads the migration connection from here, not from schema.prisma.
// Migrations use DIRECT_URL (the session pooler) — `prisma migrate` needs a
// session-mode connection. Runtime connections use DATABASE_URL (the
// transaction pooler) via the driver adapter in lib/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
