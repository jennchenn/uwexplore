from ..models.course import Course
from ..models.schedule import Schedule
from ..models.user import PastCourses

MAX_QUERY_SIZE = 30


class CourseService:
    def __init__(self, logger):
        self.logger = logger

    def get_courses(self, course_codes=None, search_query_list=None):
        """
        Retrieve courses in database based on specified filters
        :param course_codes: A list of course codes to search by e.g. '1', '2'
        :type course_codes: list of strings
        :param search_query_list: Keyword to run case-insensitive search for in description/title
        :type search_query_list: list of one string element
        :raise Exception: if error encountered querying the database or unpacking args
        """
        try:
            filters = []

            if course_codes:
                code_filter = []
                for code in course_codes:
                    if (
                        code == "5"
                    ):  # this is a general catch-all for codes that don't start with 1-4
                        code_filter.append({"code": {"$regex": f"^[^1234]"}})
                    else:
                        code_filter.append({"code": {"$regex": f"^{code}"}})
                if code_filter:
                    filters.append({"$or": code_filter})

            if search_query_list:
                # we expect search_query to be a list of size 1, so we fetch the actual string
                keyword = search_query_list[0]
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
                            {"department": {"$regex": f"{keyword}", "$options": "i"}},
                        ]
                    }
                )

            courses = []
            if filters:
                query_results = (
                    Course.objects(__raw__={"$and": filters})
                    .order_by("department", "course_code")
                    .limit(MAX_QUERY_SIZE)
                )
            else:
                query_results = Course.objects.order_by(
                    "department", "course_code"
                ).limit(MAX_QUERY_SIZE)

            for result in query_results:
                result_dict = result.to_serializable_dict()
                courses.append(result_dict)
            return courses

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
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

    def get_past_courses_by_user(self, user):
        try:
            past_courses = user.get("past_courses")
            if not past_courses:  # return an empty object with the expected keys
                return PastCourses().to_serializable_dict()
            for term, courses in past_courses.items():
                course_names = [
                    self._get_course_name_from_id(course_id) for course_id in courses
                ]
                past_courses[term] = course_names
            return past_courses
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def get_schedule_courses_by_user(self, user):
        try:
            schedule_id = user.get("schedule")
            return self.get_courses_by_schedule_id(schedule_id)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def get_courses_by_schedule_id(self, schedule_id):
        try:
            current_schedule = Schedule.objects(id=schedule_id).first()
            if not current_schedule:
                raise KeyError(f"No saved schedule with id={schedule_id}")
            courses = [
                course.to_serializable_dict() for course in current_schedule["courses"]
            ]
            return self._format_schedule_courses(courses)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def _format_schedule_courses(self, scheduled_courses):
        courses = []
        for course_info in scheduled_courses:
            course_obj = Course.objects(_id=course_info["course_id"]).first()
            sections = course_obj.sections
            course = dict(course_obj.to_serializable_dict())
            course["sections"] = self._find_section(sections, course_info["section_id"])
            course["color"] = course_info["color"]
            courses.append(course)
        return courses

    def _find_section(self, sections, section_id):
        for section in sections:
            if section._id == section_id:
                return section.to_serializable_dict()

    def _get_course_name_from_id(self, course_id):
        course = Course.objects(_id=course_id).first()
        return f"{course.department} {course.code}"
