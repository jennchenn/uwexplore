import json

from flask import Blueprint, current_app, jsonify, request

from ..resources.user_dto import CreateUserDTO
from ..services.user_service import UserService

user_service = UserService(current_app.logger)

blueprint = Blueprint("auth", __name__, url_prefix="/auth")


@blueprint.route("/signup", methods=["POST"], strict_slashes=False)
def signup():
    try:
        new_user = CreateUserDTO(**request.json)
        result = user_service.create_user(new_user)
        return jsonify(result), 200

    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/login", methods=["POST"], strict_slashes=False)
def login():
    try:
        email = request.json["email"]
        password = request.json["password"]
        result = user_service.login(email, password)
        return jsonify(result), 200

    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/refresh", methods=["POST"], strict_slashes=False)
def refresh_token():
    try:
        refresh_token = request.json["refresh_token"]
        result = user_service.refresh_token(refresh_token)
        return jsonify(result), 200

    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/reset", methods=["POST"], strict_slashes=False)
def reset_password():
    try:
        email = request.json["email"]
        result = user_service.reset_password(email)
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
