from flask import Blueprint, current_app, jsonify, request

from ..middlewares.authentication import require_login
from ..services.schedule_service import ScheduleService

schedule_service = ScheduleService(current_app.logger)

blueprint = Blueprint("schedule", __name__, url_prefix="/schedules")


@blueprint.route("/", methods=["GET", "POST", "PUT", "DELETE"], strict_slashes=False)
@require_login
def schedule_courses_by_user(curr_user):
    try:
        if request.method == "GET":
            result = schedule_service.get_schedule_courses_by_user(curr_user)
        elif request.method == "POST":
            request_data = request.get_json()
            course_id = request_data["course_id"]
            section_id = request_data["section_id"]
            color = request_data["color"]
            result = schedule_service.add_course_to_schedule_by_user(
                curr_user, course_id, section_id, color
            )
        elif request.method == "PUT":
            request_data = request.get_json()
            uid = request_data["uid"]
            color = request_data["color"]
            result = schedule_service.update_schedule_color_by_user(
                curr_user, uid, color
            )
        elif request.method == "DELETE":
            request_data = request.get_json()
            course_id = request_data.get("course_id", None)
            schedule_object_id = request_data.get(
                "id", None
            )  # this should be one of the UIDs returned from the above calls
            if course_id:
                result = schedule_service.delete_courses_from_schedule_by_user(
                    curr_user, course_id
                )
            elif schedule_object_id:
                result = schedule_service.delete_course_from_schedule_by_user(
                    curr_user, schedule_object_id
                )
            else:
                raise Exception("At least one id must be specified for deletion!")
        else:
            raise Exception(f"Unsupported method {request.method}")
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500


@blueprint.route(
    "/<id>", methods=["GET", "POST", "PUT", "DELETE"], strict_slashes=False
)
def schedule_courses_by_id(id):
    try:
        if request.method == "GET":
            result = schedule_service.get_courses_by_schedule_id(id)
        elif request.method == "POST":
            request_data = request.get_json()
            course_id = request_data["course_id"]
            section_id = request_data["section_id"]
            color = request_data["color"]
            result = schedule_service.add_course_to_schedule_by_id(
                id, course_id, section_id, color
            )
        elif request.method == "PUT":
            request_data = request.get_json()
            uid = request_data["uid"]
            color = request_data["color"]
            result = schedule_service.update_schedule_color_by_id(id, uid, color)
        elif request.method == "DELETE":
            request_data = request.get_json()
            course_id = request_data.get("course_id", None)
            schedule_object_id = request_data.get(
                "id", None
            )  # this should be one of the UIDs returned from the above calls
            if course_id:
                result = schedule_service.delete_courses_from_schedule_by_id(
                    id, course_id
                )
            elif schedule_object_id:
                result = schedule_service.delete_course_from_schedule_by_id(
                    id, schedule_object_id
                )
            else:
                raise Exception("At least one id must be specified for deletion!")
        else:
            raise Exception(f"Unsupported method {request.method}")
        return jsonify(result), 200
    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
