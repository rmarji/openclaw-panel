import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { pendingCheckouts, users } from "@/lib/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/onboarding",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Link pending checkout to this user if one exists
      const pending = await db.query.pendingCheckouts.findFirst({
        where: eq(pendingCheckouts.email, user.email),
        orderBy: (pc, { desc }) => [desc(pc.createdAt)],
      });

      if (pending && pending.status === "pending") {
        // Mark pending checkout as completed — the webhook handler
        // already created subscription + agent records keyed by email
        await db
          .update(pendingCheckouts)
          .set({ status: "completed" })
          .where(eq(pendingCheckouts.id, pending.id));
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
