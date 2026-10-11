import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7;

const sha256 = (s: string) => createHash("sha256").update(s).digest();

/** True when the environment has everything /admin needs. */
export function adminConfigured() {
  return Boolean(
    process.env.DATABASE_URL && process.env.ADMIN_PASSWORD && (process.env.SESSION_SECRET?.length ?? 0) >= 32,
  );
}

/** Signs with both secrets, so changing the password signs every session out. */
function sign(payload: string) {
  const key = createHmac("sha256", process.env.SESSION_SECRET!).update(sha256(process.env.ADMIN_PASSWORD!)).digest();
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function valid(token: string | undefined) {
  const [payload, mac] = token?.split(".") ?? [];
  if (!payload || !mac) return false;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdmin() {
  return adminConfigured() && valid((await cookies()).get(COOKIE)?.value);
}

/** Call at the top of every admin page and action. Sends visitors without a session to the login page. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login/");
}

export async function startSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export function passwordMatches(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && timingSafeEqual(sha256(input), sha256(expected!));
}

// ── Login throttling: per address, plus a global cap against distributed guessing ──

const WINDOW = 15 * 60 * 1000;
const LIMITS = { address: 8, global: 50 };
const failures = new Map<string, { count: number; reset: number }>();

function bucket(id: string) {
  const now = Date.now();
  if (failures.size > 5000) for (const [k, b] of failures) if (b.reset < now) failures.delete(k);
  let b = failures.get(id);
  if (!b || b.reset < now) failures.set(id, (b = { count: 0, reset: now + WINDOW }));
  return b;
}

async function address() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Minutes until another login attempt is allowed, or 0. */
export async function loginBlockedFor() {
  const mine = bucket(`ip:${await address()}`);
  const all = bucket("global");
  const blocked = [mine.count >= LIMITS.address && mine, all.count >= LIMITS.global && all].filter(Boolean) as {
    reset: number;
  }[];
  return blocked.length ? Math.ceil((Math.max(...blocked.map((b) => b.reset)) - Date.now()) / 60000) : 0;
}

export async function recordFailedLogin() {
  bucket(`ip:${await address()}`).count++;
  bucket("global").count++;
}

export async function clearFailedLogins() {
  failures.delete(`ip:${await address()}`);
}
