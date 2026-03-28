// AUTH-KIT TEMPLATE: Login Page
// Target: app/(auth)/login/page.tsx
// Requires: npm install better-auth

"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

// ---------------------------------------------------------------------------
// Minimal login page using Better Auth's client-side signIn helper.
// No CSS framework required -- uses inline styles for a clean default look.
// ---------------------------------------------------------------------------

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Validate callbackUrl to prevent open redirect attacks.
  // Only allow relative paths (starting with /) — reject external URLs.
  const rawCallback = searchParams.get("callbackUrl") || "/dashboard";
  const callbackUrl = rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message ?? "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Redirect to the original page (from middleware callbackUrl) or dashboard.
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.subtitle}>
          Welcome back. Enter your credentials to continue.
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={styles.link}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline styles -- replace with your own CSS / Tailwind / CSS Modules.
// ---------------------------------------------------------------------------

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "1rem",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  title: {
    margin: "0 0 0.25rem",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#111",
  },
  subtitle: {
    margin: "0 0 1.5rem",
    fontSize: "0.875rem",
    color: "#666",
  },
  error: {
    marginBottom: "1rem",
    padding: "0.75rem",
    borderRadius: "6px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: "0.875rem",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#333",
    marginTop: "0.25rem",
  },
  input: {
    padding: "0.625rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "0.875rem",
    outline: "none",
  },
  button: {
    marginTop: "0.75rem",
    padding: "0.625rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#111",
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  footer: {
    marginTop: "1.25rem",
    textAlign: "center" as const,
    fontSize: "0.875rem",
    color: "#666",
  },
  link: {
    color: "#111",
    fontWeight: 600,
    textDecoration: "underline",
  },
};
