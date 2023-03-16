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


@blueprint.route("/saved", methods=["GET"], strict_slashes=False)
@require_login
def get_saved_courses(curr_user):
    try:
        result = course_service.get_saved_courses_by_user(curr_user)
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/past", methods=["GET"], strict_slashes=False)
@require_login
def get_past_courses(curr_user):
    try:
        result = course_service.get_past_courses_by_user(curr_user)
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route(
    "/schedule", methods=["GET", "POST", "PUT", "DELETE"], strict_slashes=False
)
@require_login
def schedule_courses_by_user(curr_user):
    try:
        if request.method == "GET":
            result = course_service.get_schedule_courses_by_user(curr_user)
        elif request.method == "POST":
            request_data = request.get_json()
            course_id = request_data["course_id"]
            section_id = request_data["section_id"]
            color = request_data["color"]
            result = course_service.add_course_to_schedule_by_user(
                curr_user, course_id, section_id, color
            )
        elif request.method == "PUT":
            request_data = request.get_json()
            uid = request_data["uid"]
            color = request_data["color"]
            result = course_service.update_schedule_color_by_user(curr_user, uid, color)
        elif request.method == "DELETE":
            request_data = request.get_json()
            schedule_object_id = request_data[
                "id"
            ]  # this should be one of the UIDs returned from the above calls
            result = course_service.delete_course_from_schedule_by_user(
                curr_user, schedule_object_id
            )
        else:
            raise Exception(f"Unsupported method {request.method}")
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route(
    "/schedules/<id>", methods=["GET", "POST", "PUT", "DELETE"], strict_slashes=False
)
def schedule_courses_by_id(id):
    try:
        if request.method == "GET":
            result = course_service.get_courses_by_schedule_id(id)
        elif request.method == "POST":
            request_data = request.get_json()
            course_id = request_data["course_id"]
            section_id = request_data["section_id"]
            color = request_data["color"]
            result = course_service.add_course_to_schedule_by_id(
                id, course_id, section_id, color
            )
        elif request.method == "PUT":
            request_data = request.get_json()
            uid = request_data["uid"]
            color = request_data["color"]
            result = course_service.update_schedule_color_by_id(id, uid, color)
        elif request.method == "DELETE":
            request_data = request.get_json()
            schedule_object_id = request_data["id"]
            result = course_service.delete_course_from_schedule_by_id(
                id, schedule_object_id
            )
        else:
            raise Exception(f"Unsupported method {request.method}")
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
