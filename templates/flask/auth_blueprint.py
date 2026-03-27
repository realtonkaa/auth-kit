# AUTH-KIT TEMPLATE: Flask Auth Blueprint
# Target: auth/routes.py (or app/auth/routes.py)
# Requires: pip install flask-login flask-wtf flask-bcrypt python-dotenv

from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from .models import db, User
from .forms import LoginForm, RegisterForm

auth = Blueprint("auth", __name__, template_folder="templates")


@auth.route("/login", methods=["GET", "POST"])
def login():
    """Handle user login via email and password."""
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))

    form = LoginForm()

    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data.lower().strip()).first()

        if user is None or not user.check_password(form.password.data):
            flash("Invalid email or password.", "error")
            return redirect(url_for("auth.login"))

        if not user.is_active:
            flash("This account has been deactivated.", "error")
            return redirect(url_for("auth.login"))

        login_user(user, remember=True)
        flash("Logged in successfully.", "success")

        # Redirect to the page the user was trying to access, or home
        next_page = request.args.get("next")
        if next_page and _is_safe_url(next_page):
            return redirect(next_page)
        return redirect(url_for("main.index"))

    return render_template("auth/login.html", form=form)


@auth.route("/register", methods=["GET", "POST"])
def register():
    """Handle new user registration."""
    if current_user.is_authenticated:
        return redirect(url_for("main.index"))

    form = RegisterForm()

    if form.validate_on_submit():
        existing_user = User.query.filter_by(
            email=form.email.data.lower().strip()
        ).first()

        if existing_user is not None:
            flash("An account with that email already exists.", "error")
            return redirect(url_for("auth.register"))

        user = User(
            name=form.name.data.strip(),
            email=form.email.data.lower().strip(),
        )
        user.set_password(form.password.data)

        db.session.add(user)
        db.session.commit()

        flash("Registration successful. Please log in.", "success")
        return redirect(url_for("auth.login"))

    return render_template("auth/register.html", form=form)


@auth.route("/logout")
@login_required
def logout():
    """Log the current user out."""
    logout_user()
    flash("You have been logged out.", "success")
    return redirect(url_for("auth.login"))


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _is_safe_url(target: str) -> bool:
    """Prevent open-redirect attacks by validating the redirect target."""
    from urllib.parse import urlparse, urljoin
    from flask import request as _request

    ref_url = urlparse(_request.host_url)
    test_url = urlparse(urljoin(_request.host_url, target))
    return test_url.scheme in ("http", "https") and ref_url.netloc == test_url.netloc
