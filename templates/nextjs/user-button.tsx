// AUTH-KIT TEMPLATE: User Button Component
// Target: src/components/user-button.tsx
// Requires: npm install better-auth

"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

// ---------------------------------------------------------------------------
// A small component that shows the authenticated user's name/email with a
// sign-out button, or a "Sign In" link when no session exists.
// Drop this into your header / navbar.
// ---------------------------------------------------------------------------

export default function UserButton() {
  const { data: session, isPending } = useSession();

  // While the session is loading, render a placeholder to avoid layout shift.
  if (isPending) {
    return <div style={styles.skeleton} aria-hidden="true" />;
  }

  // -- Not logged in -------------------------------------------------------
  if (!session) {
    return (
      <Link href="/login" style={styles.signInLink}>
        Sign In
      </Link>
    );
  }

  // -- Logged in -----------------------------------------------------------
  const displayName = session.user.name || session.user.email;

  async function handleSignOut() {
    await signOut();
    // Optionally redirect after sign-out:
    window.location.href = "/";
  }

  return (
    <div style={styles.container}>
      <div style={styles.avatar}>
        {(displayName ?? "U").charAt(0).toUpperCase()}
      </div>
      <span style={styles.name}>{displayName}</span>
      <button onClick={handleSignOut} style={styles.signOutButton}>
        Sign Out
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline styles -- replace with your own CSS / Tailwind / CSS Modules.
// ---------------------------------------------------------------------------

const styles: Record<string, React.CSSProperties> = {
  skeleton: {
    width: "120px",
    height: "36px",
    borderRadius: "6px",
    backgroundColor: "#e5e7eb",
  },
  signInLink: {
    display: "inline-block",
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    backgroundColor: "#111",
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: 600,
    textDecoration: "none",
  },
  container: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#111",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  name: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#333",
  },
  signOutButton: {
    padding: "0.375rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#333",
    fontSize: "0.8rem",
    fontWeight: 500,
    cursor: "pointer",
  },
};
