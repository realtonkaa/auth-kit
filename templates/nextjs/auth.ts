// AUTH-KIT TEMPLATE: Better Auth Server Configuration
// Target: src/lib/auth.ts (or lib/auth.ts)
// Requires: npm install better-auth

import { betterAuth } from "better-auth";

export const auth = betterAuth({
  // -- Secret & Base URL --------------------------------------------------
  // BETTER_AUTH_SECRET is used to sign tokens and cookies.
  // BETTER_AUTH_URL tells Better Auth the canonical URL of your app.
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  // -- Database Adapter ----------------------------------------------------
  // Better Auth needs a database to persist users, sessions, and accounts.
  //
  // Option A: Prisma adapter
  //   import { prismaAdapter } from "better-auth/adapters/prisma";
  //   import { PrismaClient } from "@prisma/client";
  //   const prisma = new PrismaClient();
  //   database: prismaAdapter(prisma, { provider: "sqlite" }),
  //
  // Option B: Drizzle adapter
  //   import { drizzleAdapter } from "better-auth/adapters/drizzle";
  //   import { db } from "./db";
  //   database: drizzleAdapter(db),
  //
  // Option C: Connection string (uses built-in Kysely adapter)
  database: {
    url: process.env.DATABASE_URL as string,
    // type: "sqlite",   // change to "postgres" or "mysql" as needed
  },

  // -- Email & Password Authentication -------------------------------------
  emailAndPassword: {
    enabled: true,
    // Minimum password length enforced on sign-up (default: 8)
    minPasswordLength: 8,
  },

  // -- Session Configuration -----------------------------------------------
  session: {
    // How long a session stays valid (in seconds). Default: 7 days.
    expiresIn: 60 * 60 * 24 * 7,
    // How often the session expiry is refreshed on activity (in seconds).
    updateAge: 60 * 60 * 24, // 1 day
  },
});

// Re-export types so other server files can reference them.
export type Session = typeof auth.$Infer.Session;
