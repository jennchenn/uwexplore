from bson.objectid import ObjectId

from ..models.course import Course
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
                stripped_keyword = keyword.replace(" ", "")
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
                            {
                                "full_code": {
                                    "$regex": f"{stripped_keyword}",
                                    "$options": "i",
                                }
                            },
                        ]
                    }
                )

            courses = []
            if filters:
                query_results = (
                    Course.objects(__raw__={"$and": filters})
                    .order_by("full_code")
                    .limit(MAX_QUERY_SIZE)
                )
            else:
                query_results = Course.objects.order_by("full_code").limit(
                    MAX_QUERY_SIZE
                )

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
            saved_courses_list = user.saved_courses
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
            past_courses = user.past_courses
            if not past_courses:  # return an empty object with the expected keys
                return PastCourses().to_serializable_dict()
            return self._format_past_courses(past_courses)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def add_past_course(self, user, term, course_id):
        try:
            past_courses = user.past_courses or PastCourses().to_serializable_dict()
            if term not in past_courses:
                raise KeyError(f"Invalid term={term}")
            # TODO: optimize this check for duplicates
            if ObjectId(course_id) in past_courses[term]:
                raise Exception(f"Course={course_id} already added to term={term}.")
            past_courses[term].append(course_id)
            user.save()
            return self._format_past_courses(user.past_courses)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to add past course. Reason={reason if reason else str(e)}"
            )
            raise e

    def delete_past_course(self, user, term, course_id):
        try:
            past_courses = user.past_courses or PastCourses()
            if term not in past_courses:
                raise KeyError(f"Invalid term={term}")
            try:
                past_courses[term].remove(
                    ObjectId(course_id)
                )  # will raise ValueError if course id not found
            except Exception as e:
                raise KeyError(
                    f"Course with id={course_id} does not exist in term={term}"
                )
            user.save()
            return self._format_past_courses(past_courses)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to add past course. Reason={reason if reason else str(e)}"
            )
            raise e

    def _get_course_name_from_id(self, course_id):
        course = Course.objects(_id=course_id).first()
        return f"{course.department} {course.code}"

    def _format_past_courses(self, term_to_course_ids):
        # Past courses are saved as arrays of object ids; map them to the course title before returning
        term_to_course_ids = term_to_course_ids.to_serializable_dict()
        for term, courses in term_to_course_ids.items():
            course_names = [
                self._get_course_name_from_id(course_id) for course_id in courses
            ]
            term_to_course_ids[term] = course_names
        return term_to_course_ids
