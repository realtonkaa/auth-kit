# AUTH-KIT TEMPLATE: FastAPI JWT + Password Utilities
# Target: utils/auth.py (or app/auth/utils.py)
# Requires: pip install PyJWT pwdlib[bcrypt] python-dotenv

from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from pwdlib import PasswordHash

load_dotenv()

# ---------------------------------------------------------------------------
# Configuration -- loaded from environment variables
# ---------------------------------------------------------------------------
JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "")
JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Fail fast if JWT_SECRET_KEY is not set -- never run without a real secret.
if not JWT_SECRET_KEY:
    raise RuntimeError(
        "JWT_SECRET_KEY environment variable is required. "
        "Set a strong, random secret in your .env file (e.g., openssl rand -hex 32)."
    )

# ---------------------------------------------------------------------------
# Password hashing (pwdlib with bcrypt backend)
# ---------------------------------------------------------------------------
_password_hash = PasswordHash.recommended()


def hash_password(plain_password: str) -> str:
    """Return a secure hash of *plain_password*."""
    return _password_hash.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Return True if *plain_password* matches *hashed_password*."""
    return _password_hash.verify(plain_password, hashed_password)


# ---------------------------------------------------------------------------
# JWT creation
# ---------------------------------------------------------------------------

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a signed JWT containing *data*.

    Parameters
    ----------
    data:
        Claims to encode in the token.  Must include ``"sub"`` (subject).
    expires_delta:
        Custom lifetime.  Defaults to ``ACCESS_TOKEN_EXPIRE_MINUTES``.

    Returns
    -------
    str
        The encoded JWT string.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
