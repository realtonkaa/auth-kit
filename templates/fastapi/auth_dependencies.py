# AUTH-KIT TEMPLATE: FastAPI Auth Dependencies
# Target: dependencies/auth.py (or app/auth/dependencies.py)
# Requires: pip install PyJWT fastapi sqlalchemy

from __future__ import annotations

from typing import Annotated, Generator

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from models.auth import User
from utils.auth import JWT_ALGORITHM, JWT_SECRET_KEY

# ---------------------------------------------------------------------------
# OAuth2 scheme -- tells FastAPI where to find the token
# ---------------------------------------------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ---------------------------------------------------------------------------
# Database session dependency
# ---------------------------------------------------------------------------
# Replace this with your actual session factory.  The example below assumes
# a ``SessionLocal`` created via ``sessionmaker`` somewhere in your project.

def get_db() -> Generator[Session, None, None]:
    """Yield a database session and close it when the request is done.

    Replace ``SessionLocal`` with your own session factory.
    """
    from models.auth import SessionLocal  # adjust import as needed

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Current-user dependencies
# ---------------------------------------------------------------------------

def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    """Decode the JWT and return the corresponding ``User`` object.

    Raises ``401 Unauthorized`` if the token is missing, expired, or the
    user no longer exists.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    return user


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    """Ensure the authenticated user's account is still active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )
    return current_user
