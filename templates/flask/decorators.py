# AUTH-KIT TEMPLATE: Flask Auth Decorators
# Target: auth/decorators.py (or app/auth/decorators.py)
# Requires: pip install flask-login

from functools import wraps

from flask import abort, flash, redirect, url_for
from flask_login import current_user, login_required  # re-exported for convenience


def admin_required(func):
    """Decorator that restricts a view to users whose ``role`` is 'admin'.

    Usage::

        @app.route("/admin/dashboard")
        @login_required
        @admin_required
        def admin_dashboard():
            return render_template("admin/dashboard.html")

    The ``@login_required`` decorator should be applied *before* (above)
    ``@admin_required`` so that unauthenticated users are redirected to
    the login page rather than receiving a 403.
    """

    @wraps(func)
    def decorated_view(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for("auth.login"))

        if getattr(current_user, "role", None) != "admin":
            abort(403)

        return func(*args, **kwargs)

    return decorated_view


def role_required(*roles: str):
    """Decorator factory that restricts a view to users with one of the
    given roles.

    Usage::

        @app.route("/editor/panel")
        @login_required
        @role_required("admin", "editor")
        def editor_panel():
            ...
    """

    def decorator(func):
        @wraps(func)
        def decorated_view(*args, **kwargs):
            if not current_user.is_authenticated:
                return redirect(url_for("auth.login"))

            if getattr(current_user, "role", None) not in roles:
                abort(403)

            return func(*args, **kwargs)

        return decorated_view

    return decorator
