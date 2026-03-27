// AUTH-KIT TEMPLATE: Better Auth Catch-All API Route
// Target: app/api/auth/[...all]/route.ts
// Requires: npm install better-auth

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// ---------------------------------------------------------------------------
// This catch-all route delegates every /api/auth/* request to Better Auth.
// Better Auth registers its own sub-routes for sign-in, sign-up, sign-out,
// session retrieval, and more.
//
// Make sure the file lives at:
//   app/api/auth/[...all]/route.ts
//
// If your auth.ts file is at a different path, update the import above.
// ---------------------------------------------------------------------------

export const { GET, POST } = toNextJsHandler(auth);
