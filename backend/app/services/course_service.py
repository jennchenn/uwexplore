from ..models.course import Course
from ..models.user import User


class CourseService:
    def __init__(self, logger):
        self.logger = logger

    def get_courses(self):
        courses = []

        for result in Course.objects:
            result_dict = result.to_serializable_dict()
            courses.append(result_dict)

        return courses

    def get_saved_courses_by_user(self, user):
        try:
            saved_courses = []
            saved_courses_list = user.get("saved_courses")
            if saved_courses_list:
                for course_id in saved_courses_list:
                    course = Course.objects(_id=course_id).first()
                    saved_courses.append(course.to_serializable_dict())
            return saved_courses
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e
