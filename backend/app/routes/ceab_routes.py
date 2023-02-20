from flask import Blueprint, current_app, jsonify

from ..services.ceab_service import CeabService

ceab_service = CeabService(current_app.logger)

blueprint = Blueprint("ceab", __name__, url_prefix="/ceab")


@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_ceab():
    try:
        result = ceab_service.get_ceab_numbers(None)
        return jsonify(result), 200

    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
