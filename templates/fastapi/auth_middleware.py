# AUTH-KIT TEMPLATE: FastAPI CORS + Security Middleware
# Target: middleware/security.py (or app/middleware.py)
# Requires: pip install fastapi

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def configure_cors(app: FastAPI) -> None:
    """Add a restrictive CORS policy to the FastAPI application.

    Adjust ``allow_origins`` to list the exact front-end origins that
    should be permitted.  Avoid using ``["*"]`` in production.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",   # Local front-end dev server
            "http://localhost:5173",   # Vite dev server
            # Add your production domain(s) here:
            # "https://yourdomain.com",
        ],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )


# ---------------------------------------------------------------------------
# Rate limiting
# ---------------------------------------------------------------------------
# FastAPI does not include built-in rate limiting.  Two popular options:
#
# 1. slowapi  (pip install slowapi)
#    - Uses ``limits`` library under the hood.
#    - Example:
#
#        from slowapi import Limiter
#        from slowapi.util import get_remote_address
#
#        limiter = Limiter(key_func=get_remote_address)
#        app.state.limiter = limiter
#
#        @router.post("/auth/login")
#        @limiter.limit("5/minute")
#        def login(request: Request, ...):
#            ...
#
# 2. Reverse-proxy level (recommended for production)
#    - Configure rate limits in Nginx, Caddy, or your cloud provider's
#      API gateway.  This keeps the application layer simple and pushes
#      abuse mitigation to the edge.
#
# Choose whichever approach fits your deployment model.
# ---------------------------------------------------------------------------


# ---------------------------------------------------------------------------
# Security headers
# ---------------------------------------------------------------------------
# For production, consider adding security headers via middleware or your
# reverse proxy.  Key headers to set:
#
#   Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
#   X-Content-Type-Options: nosniff
#   X-Frame-Options: DENY
#   Content-Security-Policy: default-src 'self'
#   Referrer-Policy: strict-origin-when-cross-origin
#
# Example with Starlette middleware:
#
#   from starlette.middleware.base import BaseHTTPMiddleware
#   from starlette.requests import Request
#   from starlette.responses import Response
#
#   class SecurityHeadersMiddleware(BaseHTTPMiddleware):
#       async def dispatch(self, request: Request, call_next):
#           response: Response = await call_next(request)
#           response.headers["X-Content-Type-Options"] = "nosniff"
#           response.headers["X-Frame-Options"] = "DENY"
#           response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
#           return response
#
#   app.add_middleware(SecurityHeadersMiddleware)
# ---------------------------------------------------------------------------
