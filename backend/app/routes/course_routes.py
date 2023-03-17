from flask import Blueprint, current_app, jsonify, request

from ..middlewares.authentication import require_login
from ..services.course_service import CourseService

course_service = CourseService(current_app.logger)

blueprint = Blueprint("course", __name__, url_prefix="/courses")


@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_courses():
    try:
        # set flat=False to allow multiple values for each arg
        # format of args is { arg: [ val1, ... ] }
        args = request.args.to_dict(flat=False)
        result = course_service.get_courses(
            course_codes=args.get("code", None),
            search_query_list=args.get("query", None),
        )
        return jsonify(result), 200

    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/saved", methods=["GET", "POST"], strict_slashes=False)
@require_login
def saved_courses(curr_user):
    try:
        if request.method == "GET":
            result = course_service.get_saved_courses_by_user(curr_user)
        elif request.method == "POST":
            request_data = request.get_json()
            course_id = request_data["course_id"]
            result = course_service.add_saved_course_by_user(curr_user, course_id)
        else:
            raise Exception(f"Unsupported method {request.method}")
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/past", methods=["GET", "POST", "DELETE"], strict_slashes=False)
@require_login
def past_courses(curr_user):
    try:
        if request.method == "GET":
            result = course_service.get_past_courses_by_user(curr_user)
        elif request.method == "POST":
            request_data = request.get_json()
            term = request_data["term"]
            course_id = request_data["course_id"]
            result = course_service.add_past_course(curr_user, term, course_id)
        elif request.method == "DELETE":
            request_data = request.get_json()
            term = request_data["term"]
            course_id = request_data["course_id"]
            result = course_service.delete_past_course(curr_user, term, course_id)
        else:
            raise Exception(f"Unsupported method {request.method}")
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
