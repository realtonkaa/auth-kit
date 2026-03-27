// AUTH-KIT TEMPLATE: Sign Up Page
// Target: app/(auth)/signup/page.tsx
// Requires: npm install better-auth

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";

// ---------------------------------------------------------------------------
// Minimal registration page using Better Auth's client-side signUp helper.
// No CSS framework required -- uses inline styles for a clean default look.
// ---------------------------------------------------------------------------

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic client-side guard (server enforces the real minimum).
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await signUp.email({
        email,
        password,
        name,
      });

      if (authError) {
        setError(authError.message ?? "Could not create account.");
        setLoading(false);
        return;
      }

      // Redirect to dashboard after successful registration.
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>
          Fill in the details below to get started.
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

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
            minLength={8}
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" style={styles.link}>
            Sign In
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
