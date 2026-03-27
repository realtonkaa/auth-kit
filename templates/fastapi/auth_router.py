# AUTH-KIT TEMPLATE: FastAPI Auth Router
# Target: routers/auth.py (or app/routers/auth.py)
# Requires: pip install PyJWT pwdlib[bcrypt] python-dotenv python-multipart

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .auth_dependencies import get_current_active_user, get_db
from .auth_models import User, UserCreate, UserResponse, Token
from .auth_utils import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """Create a new user account.

    Hashes the password before storing it.  Returns the created user
    (without the password hash).
    """
    existing = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with that email already exists.",
        )

    user = User(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Authenticate with email (passed as ``username``) and password.

    Returns a JWT access token on success.  The token should be sent in
    subsequent requests via the ``Authorization: Bearer <token>`` header.
    """
    user = db.query(User).filter(User.email == form_data.username.lower().strip()).first()

    if user is None or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated.",
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_active_user)):
    """Return the profile of the currently authenticated user."""
    return current_user


@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(current_user: User = Depends(get_current_active_user)):
    """Logout endpoint (informational).

    JWTs are stateless -- the server does not maintain sessions.  The
    client should discard the token on logout.  If you need server-side
    token revocation, implement a token blocklist (e.g. in Redis).
    """
    return {"detail": "Successfully logged out. Please discard your token on the client."}
