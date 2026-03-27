# AUTH-KIT TEMPLATE: Flask WTForms for Authentication
# Target: auth/forms.py (or app/auth/forms.py)
# Requires: pip install flask-wtf email-validator

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import (
    DataRequired,
    Email,
    EqualTo,
    Length,
    ValidationError,
)


class LoginForm(FlaskForm):
    """Form rendered on the /login page."""

    email = StringField(
        "Email",
        validators=[
            DataRequired(message="Email is required."),
            Email(message="Please enter a valid email address."),
        ],
    )
    password = PasswordField(
        "Password",
        validators=[DataRequired(message="Password is required.")],
    )
    submit = SubmitField("Log In")


class RegisterForm(FlaskForm):
    """Form rendered on the /register page."""

    name = StringField(
        "Name",
        validators=[
            DataRequired(message="Name is required."),
            Length(min=1, max=128, message="Name must be between 1 and 128 characters."),
        ],
    )
    email = StringField(
        "Email",
        validators=[
            DataRequired(message="Email is required."),
            Email(message="Please enter a valid email address."),
        ],
    )
    password = PasswordField(
        "Password",
        validators=[
            DataRequired(message="Password is required."),
            Length(min=8, message="Password must be at least 8 characters."),
        ],
    )
    confirm_password = PasswordField(
        "Confirm Password",
        validators=[
            DataRequired(message="Please confirm your password."),
            EqualTo("password", message="Passwords must match."),
        ],
    )
    submit = SubmitField("Register")

    # ------------------------------------------------------------------
    # Custom validators (optional, uncomment if you import User model)
    # ------------------------------------------------------------------
    # def validate_email(self, field):
    #     from .models import User
    #     if User.query.filter_by(email=field.data.lower().strip()).first():
    #         raise ValidationError("An account with that email already exists.")
