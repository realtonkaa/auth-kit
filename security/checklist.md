# Security Checklist

Auth-kit scaffolds these security features by default:

## Passwords
- [x] Hashed with bcrypt or argon2 (never stored in plaintext)
- [x] Minimum 8 characters enforced
- [x] Constant-time password comparison (prevents timing attacks)

## Sessions & Tokens
- [x] JWT tokens have short expiration (15-30 minutes)
- [x] Cookies set to httpOnly (no JavaScript access)
- [x] Cookies set to secure in production (HTTPS only)
- [x] sameSite set to 'lax' (CSRF protection)
- [x] Secrets loaded from environment variables (never hardcoded)

## Input Validation
- [x] Email format validated
- [x] Password strength requirements enforced
- [x] SQL injection prevented via ORM / parameterized queries
- [x] XSS prevented via framework defaults

## HTTP Security
- [x] CSRF protection enabled
- [x] CORS configured restrictively (not wildcard)
- [x] Security headers added (helmet for Express)
- [x] Rate limiting recommended on auth endpoints

## Secrets Management
- [x] .env.example generated (not .env with real values)
- [x] .env added to .gitignore
- [x] All secrets via environment variables

## What You Should Do Next
- [ ] Replace placeholder values in .env with real secrets
- [ ] Set up OAuth apps (Google Console, GitHub Developer Settings) if using OAuth
- [ ] Run database migrations if applicable
- [ ] Add rate limiting to auth endpoints in production
- [ ] Set up email service for password reset / verification (if needed)
- [ ] Review generated code and customize to your needs
