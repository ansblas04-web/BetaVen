import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    newUser: "/onboarding",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage = nextUrl.pathname.startsWith("/auth");
      const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding");

      if (isOnAuthPage || isOnOnboarding) {
        return true;
      }

      return isLoggedIn;
    },
  },
  providers: [], // Providers are added in auth.ts
} satisfies NextAuthConfig;
