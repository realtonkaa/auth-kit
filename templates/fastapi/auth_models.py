# AUTH-KIT TEMPLATE: FastAPI Auth Models (Pydantic + SQLAlchemy)
# Target: models/auth.py (or app/models/auth.py)
# Requires: pip install pydantic[email] sqlalchemy

from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import Boolean, Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# ---------------------------------------------------------------------------
# Database setup -- replace DATABASE_URL with your own or load from env
# ---------------------------------------------------------------------------
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

engine = create_engine(
    DATABASE_URL,
    # Required for SQLite; remove for PostgreSQL / MySQL
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# SQLAlchemy ORM model
# ---------------------------------------------------------------------------

class User(Base):
    """Persisted user record."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(254), unique=True, index=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    name = Column(String(128), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    role = Column(String(32), default="user", nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"


# ---------------------------------------------------------------------------
# Pydantic schemas (request / response)
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    """Payload for POST /auth/register."""

    name: str = Field(..., min_length=1, max_length=128)
    email: EmailStr
    password: str = Field(..., min_length=8, description="Minimum 8 characters")


class UserResponse(BaseModel):
    """Public-facing user representation (no password hash)."""

    id: int
    email: str
    name: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    """JWT token returned after successful authentication."""

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Decoded content of a JWT (internal use)."""

    sub: str | None = None
