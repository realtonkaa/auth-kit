# AUTH-KIT TEMPLATE: Flask User Model (SQLAlchemy + Flask-Login)
# Target: auth/models.py (or app/models.py)
# Requires: pip install flask-sqlalchemy flask-login

from datetime import datetime, timezone

from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(UserMixin, db.Model):
    """Application user stored in the database."""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(254), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    role = db.Column(db.String(32), default="user", nullable=False)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # ------------------------------------------------------------------
    # Password helpers
    # ------------------------------------------------------------------

    def set_password(self, password: str) -> None:
        """Hash and store the user's password.

        Uses werkzeug's PBKDF2 implementation by default.  To switch to
        bcrypt, change the ``method`` parameter (requires ``flask-bcrypt``).
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Return True if *password* matches the stored hash."""
        return check_password_hash(self.password_hash, password)

    # ------------------------------------------------------------------
    # Representation
    # ------------------------------------------------------------------

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r}>"


# ---------------------------------------------------------------------------
# Flask-Login user loader
# ---------------------------------------------------------------------------
# Call ``init_login_manager(app)`` once during application factory setup.
# ---------------------------------------------------------------------------

def init_login_manager(app):
    """Configure Flask-Login on the given Flask application."""
    from flask_login import LoginManager

    login_manager = LoginManager()
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please log in to access this page."
    login_manager.login_message_category = "info"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id: str) -> User | None:
        """Callback used by Flask-Login to reload a user from the session."""
        return db.session.get(User, int(user_id))
