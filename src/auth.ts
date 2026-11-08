import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: { label: "邮箱", type: "email" }, password: { label: "密码", type: "password" } },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.passwordHash) return null;
        const valid = await compare(parsed.data.password, user.passwordHash);
        return valid ? { id: user.id, email: user.email, name: user.name, image: user.image } : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) token.sub = user.id;
      if (user || trigger === "update") {
        const membership = await prisma.organizationMember.findFirst({
          where: { userId: token.sub },
          include: { organization: { select: { id: true, name: true } } },
          orderBy: { joinedAt: "asc" },
        });
        token.organizationId = membership?.organization.id ?? null;
        token.organizationName = membership?.organization.name ?? null;
        token.role = membership?.role ?? null;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.user.organizationId = (token.organizationId as string | null) ?? null;
      session.user.organizationName = (token.organizationName as string | null) ?? null;
      session.user.role = (token.role as typeof session.user.role) ?? null;
      return session;
    },
  },
});
