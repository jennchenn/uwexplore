from flask import Blueprint, current_app, jsonify, request

from ..middlewares.authentication import require_login
from ..services.schedule_service import ScheduleService

schedule_service = ScheduleService(current_app.logger)

blueprint = Blueprint("schedule", __name__, url_prefix="/schedules")


@blueprint.route("/id", methods=["GET"], strict_slashes=False)
@require_login
def get_schedule_id_by_user(curr_user):
    try:
        result = schedule_service.get_schedule_id_by_user(curr_user)
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/", methods=["GET", "POST", "PUT"], strict_slashes=False)
@require_login
def schedule_courses_by_user(curr_user):
    try:
        if request.method == "GET":
            result = schedule_service.get_schedule_courses_by_user(curr_user)
        elif request.method == "POST":
            courses = request.get_json()
            result = schedule_service.add_courses_to_schedule_by_user(
                curr_user, courses
            )
        elif request.method == "PUT":
            request_data = request.get_json()
            color = request_data["color"]
            uid = request_data.get("uid", None)
            course_id = request_data.get("course_id", None)
            if uid:
                result = schedule_service.update_schedule_color_by_user(
                    curr_user, uid, color
                )
            elif course_id:
                result = schedule_service.update_schedule_colors_by_user(
                    curr_user, course_id, color
                )
            else:
                return (
                    jsonify(
                        {"error": "At least one of course id or uid must be specified"}
                    ),
                    400,
                )
            result = schedule_service.update_schedule_color_by_user(
                curr_user, uid, color
            )
        else:
            raise Exception(f"Unsupported method {request.method}")
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/uid/<uid>", methods=["DELETE"], strict_slashes=False)
@require_login
def delete_course_by_user_by_id(curr_user, uid):
    try:
        result = schedule_service.delete_course_from_schedule_by_user(curr_user, uid)
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/new", methods=["POST"], strict_slashes=False)
def create_new_schedule():
    try:
        result = schedule_service.create_new_schedule()
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/course/<course_id>", methods=["DELETE"], strict_slashes=False)
@require_login
def delete_courses_by_user_by_course_id(curr_user, course_id):
    try:
        result = schedule_service.create_new_schedule()
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<id>", methods=["GET", "POST", "PUT"], strict_slashes=False)
def schedule_courses_by_id(id):
    try:
        if request.method == "GET":
            result = schedule_service.get_courses_by_schedule_id(id)
        elif request.method == "POST":
            courses = request.get_json()
            result = schedule_service.add_courses_to_schedule_by_id(id, courses)
        elif request.method == "PUT":
            request_data = request.get_json()
            color = request_data["color"]
            uid = request_data.get("uid", None)
            course_id = request_data.get("course_id", None)
            if uid:
                result = schedule_service.update_schedule_color_by_id(id, uid, color)
            elif course_id:
                result = schedule_service.update_schedule_colors_by_id(
                    id, course_id, color
                )
            else:
                return (
                    jsonify(
                        {"error": "At least one of course id or uid must be specified"}
                    ),
                    400,
                )
        else:
            raise Exception(f"Unsupported method {request.method}")
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<id>/uid/<uid>", methods=["DELETE"], strict_slashes=False)
def delete_course_by_id(id, uid):
    try:
        result = schedule_service.delete_course_from_schedule_by_id(id, uid)
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route("/<id>/course/<course_id>", methods=["DELETE"], strict_slashes=False)
def delete_courses_by_course_id(id, course_id):
    try:
        result = schedule_service.delete_courses_from_schedule_by_id(id, course_id)
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
