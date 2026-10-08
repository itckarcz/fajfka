import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { seedDefaultItems } from "@/lib/seedItems";

// ── Only available in development ────────────────────────────────────────────

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  const DEV_EMAIL = "dev@fajfka.test";

  // 1. Upsert dev user
  const user = await db.user.upsert({
    where: { email: DEV_EMAIL },
    update: {},
    create: {
      email: DEV_EMAIL,
      name: "Test Instalatér",
      emailVerified: new Date(),
    },
  });

  // 2. Upsert test account (Firma, plátce DPH)
  const account = await db.account.upsert({
    where: { ico: "12345678" },
    update: {},
    create: {
      ico: "12345678",
      name: "ABC Instalatér s.r.o.",
      street: "Instalatérská 42",
      city: "Praha",
      zip: "11000",
      dic: "CZ12345678",
      vatStatus: "PAYER",
      iban: "CZ6508000000192000145399",
      eetMode: "NOT_SET",
    },
  });

  // 3. Link user → account
  if (!user.accountId) {
    await db.user.update({
      where: { id: user.id },
      data: { accountId: account.id },
    });
  }

  // 4. Seed default pricelist items (no-op if already exists)
  await seedDefaultItems(account.id);

  // 5. Create database session (30 days)
  const sessionToken = randomUUID();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.session.upsert({
    where: { sessionToken },
    update: { expires },
    create: { sessionToken, userId: user.id, expires },
  });

  // 6. Set session cookie and redirect to home
  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(new URL("/", origin));

  // Auth.js v5 uses "authjs.session-token" on HTTP, "__Secure-authjs.session-token" on HTTPS
  const isSecure = origin.startsWith("https://");
  const cookieName = isSecure ? "__Secure-authjs.session-token" : "authjs.session-token";

  response.cookies.set(cookieName, sessionToken, {
    expires,
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
    path: "/",
  });

  return response;
}
