from flask import Blueprint, current_app, jsonify

from ..middlewares.authentication import require_login
from ..services.course_service import CourseService

course_service = CourseService(current_app.logger)

blueprint = Blueprint("course", __name__, url_prefix="/courses")


@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_courses():
    try:
        args = request.args.to_dict(flat=False)
        result = course_service.get_courses(
            course_codes=args.get("code", None),
            search_query=args.get("query", None),
        )
        return jsonify(result), 200

    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/saved", methods=["GET"], strict_slashes=False)
@require_login
def get_saved_courses(curr_user):
    try:
        result = course_service.get_saved_courses_by_user(curr_user)
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
