import json

from flask import Blueprint, current_app, jsonify, request

from ..services.course_service import CourseService

course_service = CourseService(current_app.logger)

blueprint = Blueprint("course", __name__, url_prefix="/course")


@blueprint.route("/", methods=["GET"], strict_slashes=False)
def get_courses():
    try:
        result = course_service.get_courses()
        print(result)
        return jsonify(result), 200

    except Exception as e:
        error_message = getattr(e, "message", None)
        return jsonify({"error": (error_message if error_message else str(e))}), 500
