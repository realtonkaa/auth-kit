# auth-kit

> Add authentication to any project in 30 seconds. One command. Framework-detected. Security baked in.

[![Tests](https://github.com/realtonkaa/auth-kit/actions/workflows/test.yml/badge.svg)](https://github.com/realtonkaa/auth-kit/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## The Problem

Every developer skips auth until it's too late, then bolts on something insecure. Auth is boring to set up, critical to get right, and different for every framework. Existing auth skills are locked to one library.

## The Solution

auth-kit detects your framework, recommends the right auth library, and scaffolds production-ready authentication — routes, middleware, models, and environment templates. One command: `/auth`.

## Supported Frameworks

| Framework | Auth Library | What You Get |
|-----------|-------------|--------------|
| **Next.js** | Better Auth | Server config, API routes, middleware, login/signup pages, user button |
| **Express.js** | Passport.js | Strategies, session config, auth routes, user model, input validation |
| **Flask** | Flask-Login | Blueprint, forms, models, decorators, Jinja2 templates |
| **FastAPI** | JWT (PyJWT) | Router, dependencies, Pydantic models, JWT utils, CORS config |

## Quick Start

```bash
# Clone auth-kit
git clone https://github.com/realtonkaa/auth-kit.git

# Install the skill to Claude Code
mkdir -p ~/.claude/skills/auth
cp auth-kit/SKILL.md ~/.claude/skills/auth/SKILL.md
cp -r auth-kit/templates ~/.claude/skills/auth/templates
```

Then in any project:
```
/auth
```

Claude will:
1. Detect your framework from package.json / requirements.txt
2. Ask what auth features you want
3. Install dependencies
4. Scaffold all auth files
5. Wire everything up
6. Print a security checklist

## What Gets Scaffolded

### Next.js (Better Auth)
```
src/lib/auth.ts              # Server-side auth config
src/lib/auth-client.ts       # Client-side helper (useSession, signIn, signOut)
src/app/api/auth/[...all]/route.ts  # Catch-all API handler
src/middleware.ts             # Protected route middleware
src/app/(auth)/login/page.tsx    # Login page
src/app/(auth)/signup/page.tsx   # Registration page
src/components/user-button.tsx   # User avatar + sign out
.env.example                 # Environment template
```

### Express.js (Passport.js)
```
config/passport.js           # Passport strategies + init
config/session.js            # express-session with store
routes/auth.js               # /register, /login, /logout, /me
middleware/auth.js            # ensureAuthenticated guard
middleware/validation.js      # Input validation rules
models/User.js               # Mongoose user schema
.env.example
```

### Flask (Flask-Login)
```
auth/routes.py               # Blueprint: /login, /register, /logout
auth/models.py               # User model with password hashing
auth/forms.py                # WTForms login + register
auth/decorators.py           # @admin_required
templates/auth/login.html    # Login page
templates/auth/register.html # Register page
.env.example
```

### FastAPI (JWT)
```
routers/auth.py              # /register, /login, /me endpoints
dependencies/auth.py         # get_current_user dependency
models/auth.py               # Pydantic + SQLAlchemy models
utils/auth.py                # JWT + password hashing utils
middleware/auth.py            # CORS + security config
.env.example
```

## Security by Default

Every scaffold includes these security features out of the box:

- Passwords hashed with bcrypt or argon2 (never plaintext)
- Cookies: httpOnly, secure in production, sameSite: lax
- All secrets from environment variables (never hardcoded)
- JWT tokens with expiration (30 min default)
- Input validation on all auth endpoints
- CSRF protection enabled
- CORS configured restrictively (no wildcards)
- .env added to .gitignore automatically

## How It Works

```
/auth
  |
  v
[1. DETECT] Read package.json / requirements.txt
  |          -> Next.js? Express? Flask? FastAPI?
  v
[2. CONFIRM] Show what was detected, ask preferences
  |          -> Email/password? OAuth? Both?
  v
[3. SCAFFOLD] Install deps, write template files
  |           -> Adapted to your project structure
  v
[4. VALIDATE] Check generated code, print summary
             -> Security checklist + next steps
```

## Architecture

```
auth-kit/
├── SKILL.md                 # Prompt engineering (the brain)
├── templates/
│   ├── nextjs/              # 8 template files (Better Auth)
│   ├── express/             # 7 template files (Passport.js)
│   ├── flask/               # 7 template files (Flask-Login)
│   └── fastapi/             # 6 template files (JWT)
├── security/
│   └── checklist.md         # Post-scaffold security checklist
└── tests/                   # 141 tests: syntax, security, detection
```

## Philosophy

- **Template-based, not AI-generated** — security-critical code comes from vetted templates, not hallucination
- **Framework-specific** — each framework gets its own optimized scaffold, not a generic one-size-fits-all
- **No lock-in** — generated code has zero dependency on auth-kit after scaffolding
- **Secure defaults** — you'd have to actively break the security to make it insecure

## 141 Tests

Every template is automatically tested for:
- **Syntax validity** — Python files parsed with `ast`, JS/TS checked for balanced braces
- **Security anti-patterns** — no hardcoded secrets, no wildcard CORS, no plaintext passwords, no weak hashing
- **Framework detection** — unit tests for all detection patterns

## Contributing

To add a new framework:
1. Create `templates/<framework>/` with auth template files
2. Each file needs an `AUTH-KIT TEMPLATE` header comment
3. Update `SKILL.md` with detection and scaffold instructions
4. Add detection fixtures to `tests/fixtures/`
5. Run `pytest tests/ -v` to verify

## License

MIT

---

> *Generated auth code follows security best practices but should be reviewed before production deployment. Always run your own security audit.*
