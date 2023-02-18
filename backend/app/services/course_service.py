from ..models.course import Course


class CourseService:
    def __init__(self, logger):
        self.logger = logger

        def get_courses(self, course_codes=None, search_query=None):
            try:
                filters = []

                if course_codes:
                    code_filter = []
                    for code in course_codes:
                        code_filter.append({"code": {"$regex": f"^{code}"}})
                    filters.append({"$or": code_filter})

                if search_query:
                    # we expect search_query to be a list of size 1, so we fetch the actual string
                    keyword = search_query[0]
                    # {"$options": "i"} allows for case insensitive search
                    filters.append(
                        {
                            "$or": [
                                {"name": {"$regex": f"{keyword}", "$options": "i"}},
                                {
                                    "description": {
                                        "$regex": f"{keyword}",
                                        "$options": "i",
                                    }
                                },
                            ]
                        }
                    )

                courses = []
                for result in Course.objects(__raw__={"$and": filters}):
                    result_dict = result.to_serializable_dict()
                    courses.append(result_dict)
                return courses

            except Exception as e:
                reason = getattr(e, "message", None)
                self.logger.error(
                    "Failed to create user. Reason = {reason}".format(
                        reason=(reason if reason else str(e))
                    )
                )
                raise e

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
