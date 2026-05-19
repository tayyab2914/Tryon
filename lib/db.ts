import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  return new PrismaClient({
    // Cap the pg connection pool well below Supabase's session-pooler limit
    // (pool_size: 15). Without this, a page that fans out many queries via
    // Promise.all — or a hot-reloading dev server with leftover pools — can
    // exhaust the pooler and fail with EMAXCONNSESSION. Excess concurrent
    // queries simply queue on the pool instead of opening new connections.
    adapter: new PrismaPg({
      connectionString,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000,
    }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy: defers client construction until the first property access.
// This keeps module-load side-effect-free so build-time analysis doesn't
// require DATABASE_URL to be set.
export const db = new Proxy({} as PrismaClient, {
  get(_, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});
