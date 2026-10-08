import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL ?? "faktury@fajfka.cz",
      // Custom email subject and content in Czech
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { Resend: ResendClient } = await import("resend");
        const resend = new ResendClient(provider.apiKey);

        await resend.emails.send({
          from: provider.from as string,
          to: email,
          subject: "Přihlásit se do Fajfky",
          html: `
            <div style="font-family: Inter, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <div style="font-family: Archivo, system-ui, sans-serif; font-weight: 800; font-size: 24px; margin-bottom: 24px;">
                Fajfka<span style="color: #E8590C;">✓</span>
              </div>
              <p style="font-size: 16px; line-height: 24px; color: #14171A;">
                Klikněte na tlačítko níže a budete přihlášeni. Odkaz je platný 24 hodin.
              </p>
              <a href="${url}" style="display: inline-block; margin: 24px 0; padding: 16px 32px; background: #14171A; color: #FFFFFF; text-decoration: none; border-radius: 10px; font-size: 17px; font-weight: 600;">
                Přihlásit se do Fajfky
              </a>
              <p style="font-size: 13px; color: #5B6168; line-height: 18px;">
                Pokud jste o přihlášení nežádali, tento e-mail ignorujte.
              </p>
            </div>
          `,
        });
      },
    }),
  ],
  pages: {
    signIn: "/prihlaseni",
    verifyRequest: "/prihlaseni/overeni",
    error: "/prihlaseni",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign-in, check if onboarding is needed (handled in middleware)
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  events: {
    async signIn({ user }) {
      // Update lastLogin timestamp
      if (user.id) {
        await db.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });
      }
    },
  },
  session: {
    strategy: "database",
  },
});
