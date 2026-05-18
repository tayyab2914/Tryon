import { Resolver } from "node:dns/promises";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";

const HOSTNAME_RE = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
const DNS_TIMEOUT_MS = 5000;

/**
 * Public resolvers used for verification lookups. Node's default resolver
 * inherits the host machine's DNS config, which in some environments points
 * at 127.0.0.1 with nothing listening — yielding ECONNREFUSED even when the
 * record is correctly published. Querying a known-good public resolver makes
 * verification independent of the host's DNS setup.
 */
const PUBLIC_DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];

/**
 * Normalizes user-entered domain input to a bare hostname.
 * Strips protocol, path, query, hash, and port; lowercases.
 * Returns null for anything that isn't a plausible public domain
 * (rejects empty input, whitespace, raw IPs, and localhost).
 */
export function normalizeHostname(input: string): string | null {
  let value = input.trim().toLowerCase();
  if (!value) return null;

  // Strip protocol and everything from the first path/query/hash separator.
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  value = value.split(/[/?#]/)[0];
  // Strip port and any trailing dot.
  value = value.split(":")[0].replace(/\.$/, "");

  if (!value || /\s/.test(value)) return null;
  if (value === "localhost") return null;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return null; // raw IPv4
  if (!HOSTNAME_RE.test(value)) return null;
  return value;
}

/** Generates the public token a brand publishes in their DNS TXT record. */
export function generateVerificationToken(): string {
  return randomBytes(16).toString("hex");
}

/** DNS name the brand must create the TXT record on. */
export function txtRecordName(hostname: string): string {
  return `_fitroom-verify.${hostname}`;
}

/** Exact TXT record value the brand must publish. */
export function txtRecordValue(token: string): string {
  return `fitroom-site-verification=${token}`;
}

export interface DnsCheckResult {
  ok: boolean;
  reason?: string;
}

/**
 * Looks up the verification TXT record for a hostname and checks it matches
 * the brand's token. Never throws — DNS failures are returned as friendly
 * reasons the brand can act on.
 */
export async function checkDnsTxt(hostname: string, token: string): Promise<DnsCheckResult> {
  const name = txtRecordName(hostname);
  const expected = txtRecordValue(token);

  const resolver = new Resolver({ timeout: DNS_TIMEOUT_MS });
  resolver.setServers(PUBLIC_DNS_SERVERS);

  let records: string[][];
  try {
    records = await withTimeout(resolver.resolveTxt(name), DNS_TIMEOUT_MS);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOTFOUND" || code === "ENODATA") {
      return {
        ok: false,
        reason: `No TXT record found at ${name} yet. DNS changes can take up to an hour to propagate — try again shortly.`,
      };
    }
    if (code === "ETIMEOUT" || code === "TIMEOUT") {
      return { ok: false, reason: "The DNS lookup timed out. Please try again in a moment." };
    }
    return { ok: false, reason: "We couldn't complete the DNS lookup. Please try again." };
  }

  // resolveTxt returns string[][] — long records are split into chunks.
  const values = records.map((chunks) => chunks.join(""));
  if (values.includes(expected)) return { ok: true };

  return {
    ok: false,
    reason: `Found TXT records at ${name}, but none matched the expected value. Double-check you copied it exactly.`,
  };
}

/**
 * Decides whether a browser Origin is allowed to use a brand's widget.
 * A verified hostname authorizes itself and all of its subdomains.
 */
export function isOriginAllowed(origin: string | null, verifiedHostnames: string[]): boolean {
  if (!origin || verifiedHostnames.length === 0) return false;

  let host: string;
  try {
    host = new URL(origin).hostname.toLowerCase();
  } catch {
    return false;
  }
  if (!host) return false;

  return verifiedHostnames.some(
    (verified) => host === verified || host.endsWith(`.${verified}`),
  );
}

/** Returns the lowercase hostnames a brand has verified. */
export async function getVerifiedHostnames(brandId: string): Promise<string[]> {
  const rows = await db.domain.findMany({
    where: { brandId, verified: true },
    select: { hostname: true },
  });
  return rows.map((r) => r.hostname);
}

/** Rejects a promise if it doesn't settle within `ms`. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => {
        const err = new Error("dns lookup timed out") as NodeJS.ErrnoException;
        err.code = "TIMEOUT";
        reject(err);
      }, ms),
    ),
  ]);
}
