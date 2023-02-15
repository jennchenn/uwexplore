from flask import Blueprint, current_app, jsonify, request

from ..services.user_service import UserService

user_service = UserService(current_app.logger)

blueprint = Blueprint("user", __name__, url_prefix="/users")


@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_user():
    try:
        email = request.args.get("email")
        result = user_service.get_user_by_email(email)
        return jsonify(result), 200
    except KeyError:
        return jsonify({"error": f"No user with email {email}"}, 404)
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
