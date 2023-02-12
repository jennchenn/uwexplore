import json

from flask import Blueprint, current_app, jsonify, request

from ..services.user_service import UserService
from ..resources.user_dto import CreateUserDTO

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
