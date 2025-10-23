import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const handler = NextAuth({
  providers: [
    // 🟢 Login bằng tài khoản backend (email + password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();
        if (res.ok && data?.user && data?.token) {
          return {
            ...data.user,
            accessToken: data.token,
          };
        }
        return null;
      },
    }),

    // 🟣 Login bằng Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // ✅ Credentials login
      if (user && (user as any).accessToken) {
        token.accessToken = (user as any).accessToken;
        token.user = user; // thêm dòng này để session có user
      }

      // ✅ Google login
      if (account?.provider === "google" && account.access_token) {
        const res = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: account.access_token }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
          token.accessToken = data.token;
          token.user = data.user;
        }
      }

      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
