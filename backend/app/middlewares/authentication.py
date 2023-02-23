from functools import wraps

from flask import current_app, jsonify, request

from ..services.user_service import UserService

user_service = UserService(current_app.logger)


def get_token(request):
    auth_token = request.headers.get("Authorization")
    if auth_token:
        # format of token is "Bearer: <token>"
        (bearer, token) = auth_token.split(" ")
        if bearer.lower() != "bearer":
            return None
        return token


def require_login(api_func):
    @wraps(api_func)
    def wrapper(*args, **kwargs):
        try:
            access_token = get_token(request)
            if not access_token:
                return (
                    jsonify({"error": "You are not logged in."}),
                    401,
                )
            try:
                user_service.get_user_by_token(access_token)
            except Exception:
                return (
                    jsonify({"error": "Invalid id provided."}),
                    401,
                )
            return api_func(*args, **kwargs)

        except Exception:
            return (
                jsonify({"error": "Error, please try again."}),
                500,
            )

    return wrapper
