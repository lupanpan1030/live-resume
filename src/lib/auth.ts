import { hkdfSync, timingSafeEqual, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

export const sessionCookieName = "__Host-live-resume-session";
export const sessionMaxAgeSeconds = 60 * 60 * 24 * 7;

export const sessionCookieOptions = {
  httpOnly: true,
  maxAge: sessionMaxAgeSeconds,
  path: "/",
  sameSite: "lax" as const,
  secure: true,
};

export type AdminSession = {
  expiresAt: string | null;
  role: "admin";
};

const sessionIssuer = "live-resume";
const sessionAudience = "live-resume-admin";
const sessionSubject = "admin";
const sessionSalt = "live-resume/owner-session/v1";
const sessionInfo = "live-resume jwt signing key";
const textEncoder = new TextEncoder();

function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

export function verifyAdminPassword(candidate: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    return false;
  }

  return timingSafeEqual(sha256(candidate), sha256(configuredPassword));
}

function resolveSigningKey() {
  const explicitSecret = process.env.AUTH_SECRET;

  if (explicitSecret) {
    return textEncoder.encode(explicitSecret);
  }

  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return null;
  }

  return new Uint8Array(
    hkdfSync(
      "sha256",
      textEncoder.encode(password),
      textEncoder.encode(sessionSalt),
      textEncoder.encode(sessionInfo),
      32
    )
  );
}

export async function createSessionToken() {
  const signingKey = resolveSigningKey();

  if (!signingKey) {
    throw new Error("Admin auth is not configured.");
  }

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(sessionIssuer)
    .setAudience(sessionAudience)
    .setSubject(sessionSubject)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds)
    .sign(signingKey);
}

export async function verifySession(
  token: string | undefined | null
): Promise<AdminSession | null> {
  if (!token) {
    return null;
  }

  const signingKey = resolveSigningKey();

  if (!signingKey) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, signingKey, {
      algorithms: ["HS256"],
      audience: sessionAudience,
      issuer: sessionIssuer,
      subject: sessionSubject,
    });

    if (payload.role !== "admin") {
      return null;
    }

    return {
      expiresAt:
        typeof payload.exp === "number"
          ? new Date(payload.exp * 1000).toISOString()
          : null,
      role: "admin",
    };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  return verifySession(token);
}

export async function isAuthed() {
  return Boolean(await getSession());
}
