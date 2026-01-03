from functools import wraps
from flask import request, current_app
from flask_smorest import abort


def require_api_key(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        expected = current_app.config.get("API_KEY")
        if not expected:
            abort(500, message="API key not configured on server")

        provided = request.headers.get("X-Api-Key") or request.headers.get("x-api-key")
        if not provided or provided != expected:
            abort(401, message="Invalid or missing X-Api-Key header")

        return func(*args, **kwargs)

    return wrapper


def require_auth_or_api_key(admin_required: bool = False):
    """Decorator that accepts either a valid X-Api-Key OR a Bearer token for an authenticated user.
    If admin_required is True, the bearer token's user must have is_admin=True.
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # First, check API key
            expected = current_app.config.get("API_KEY")
            provided_key = request.headers.get("X-Api-Key") or request.headers.get("x-api-key")
            if expected and provided_key and provided_key == expected:
                return func(*args, **kwargs)

            # Next, check bearer token
            auth = request.headers.get("Authorization")
            if not auth or not auth.lower().startswith("bearer "):
                abort(401, message="Missing credentials: provide X-Api-Key or Authorization: Bearer <token>")

            token = auth.split(None, 1)[1].strip()
            # Lazy import to avoid circular imports
            from .models.user import User
            user = User.query.filter_by(auth_token=token).first()
            if not user:
                abort(401, message="Invalid token")
            if admin_required and not user.is_admin:
                abort(403, message="Admin privileges required")

            # Attach user to request context if needed
            try:
                from flask import g
                g.current_user = user
            except Exception:
                pass

            return func(*args, **kwargs)

        return wrapper

    return decorator
