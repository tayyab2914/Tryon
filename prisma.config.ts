import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 reads the migration connection from here, not from schema.prisma.
// Runtime connections are made via the driver adapter in lib/db.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
