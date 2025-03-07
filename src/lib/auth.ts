import { UserProfile } from "@/types/api";
import NextAuth from "next-auth";
import "next-auth/jwt";

import Google from "next-auth/providers/google";

const BACKEND_ACCESS_TOKEN_LIFETIME = 60 * 60; // 60 minutes
const BACKEND_REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60; // 30 days

const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  providers: [
    Google({
      authorization: { params: { access_type: "offline" } },
    }),
  ],
  basePath: "/api/auth",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
        const { access_token, id_token } = account;

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/v1/auth/google/`,
            {
              method: "POST",
              body: JSON.stringify({ access_token, id_token }),
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            }
          );

          const data = await response.json();

          console.log(data);

          user.accessToken = data.access;
          user.refreshToken = data.refresh;

          user.profile = data.user;

          return true;
        } catch (error) {
          return false;
        }
      }

      return false;
    },
    async jwt({ token, account, user, trigger, session }) {
      if (user && account) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          profile: user.profile,
          expire: getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME,
        };
      }

      if (trigger === "update") {
        token.profile = session.user.profile;
      }

      if (getCurrentEpochTime() >= token.expire!) {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/v1/auth/token/refresh/`,
          {
            method: "POST",
            body: JSON.stringify({ refresh: token.refreshToken }),
            headers: {
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await response.json();

        console.log("token refresh");

        return {
          ...token,
          accessToken: data.access,
          expire: getCurrentEpochTime() + BACKEND_ACCESS_TOKEN_LIFETIME,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.accessToken = token.accessToken;
        session.user.profile = token.profile;
      }

      return session;
    },
  },
});

declare module "next-auth" {
  interface User {
    accessToken?: string;
    refreshToken?: string;
    profile: UserProfile;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expire?: number;
    profile: UserProfile;
  }
}
