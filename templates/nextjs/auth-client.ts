// AUTH-KIT TEMPLATE: Better Auth Client-Side Helper
// Target: src/lib/auth-client.ts (or lib/auth-client.ts)
// Requires: npm install better-auth

import { createAuthClient } from "better-auth/react";

// ---------------------------------------------------------------------------
// Create the auth client. The baseURL should point to your Next.js app so
// that client-side calls reach the /api/auth/* catch-all route.
// ---------------------------------------------------------------------------
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
});

// ---------------------------------------------------------------------------
// Convenience re-exports -- import these directly in your components.
// ---------------------------------------------------------------------------

/** React hook that returns the current session (user + session metadata). */
export const useSession = authClient.useSession;

/**
 * Sign in with email & password.
 *
 * Usage:
 *   const { data, error } = await signIn.email({
 *     email: "user@example.com",
 *     password: "securepassword",
 *   });
 */
export const signIn = authClient.signIn;

/**
 * Sign up with email & password.
 *
 * Usage:
 *   const { data, error } = await signUp.email({
 *     email: "user@example.com",
 *     password: "securepassword",
 *     name: "Jane Doe",
 *   });
 */
export const signUp = authClient.signUp;

/**
 * Sign the current user out and clear the session cookie.
 *
 * Usage:
 *   await signOut();
 */
export const signOut = authClient.signOut;
