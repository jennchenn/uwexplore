from flask import Blueprint, current_app, jsonify, request

from ..middlewares.authentication import optional_login
from ..services.ceab_service import CeabService

ceab_service = CeabService(current_app.logger)

blueprint = Blueprint("ceab", __name__, url_prefix="/ceab")


@blueprint.route("/", methods=["GET"], strict_slashes=False)
@optional_login
def get_ceab(curr_user):
    try:
        if curr_user:
            result = ceab_service.get_ceab_numbers_by_user(curr_user)
        else:
            args = request.args.to_dict()
            schedule_id = args.get("schedule_id")
            result = ceab_service.get_ceab_numbers_by_schedule(schedule_id)

        return jsonify(result), 200
    except KeyError:
        return jsonify(
            {"error": f"At least one of user or schedule_id must be specified"}, 400
        )
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
