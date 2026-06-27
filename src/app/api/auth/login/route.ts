import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookieName,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/auth";

const invalidCredentialsResponse = () =>
  NextResponse.json(
    {
      error: "Invalid credentials",
      ok: false,
    },
    { status: 401 }
  );

async function readPassword(request: Request) {
  try {
    const body = (await request.json()) as unknown;

    if (
      typeof body === "object" &&
      body !== null &&
      "password" in body &&
      typeof body.password === "string"
    ) {
      return body.password;
    }
  } catch {
    return null;
  }

  return null;
}

export async function POST(request: Request) {
  const password = await readPassword(request);

  if (!password || !verifyAdminPassword(password)) {
    return invalidCredentialsResponse();
  }

  try {
    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(sessionCookieName, token, sessionCookieOptions);

    return response;
  } catch {
    return invalidCredentialsResponse();
  }
}
