from ..models.course import Course, CourseType
from ..models.user import User


class CeabService:
    def __init__(self, logger):
        self.logger = logger

    def get_ceab_numbers(self, user):
        try:
            cse_weight = 0
            ceab_math = 0
            ceab_sci = 0
            ceab_eng = 0
            ceab_design = 0
            list_counts = {
                CourseType.TE: 0,
                CourseType.LIST_A: 0,
                CourseType.LIST_B: 0,
                CourseType.LIST_C: 0,
                CourseType.LIST_D: 0,
                CourseType.REQUIRED: 0,
            }
            current_schedule = user.get("schedule")
            past_courses = []
            # past_courses = user.get("past_courses")
            courses = current_schedule["courses"] + past_courses

            for course in courses:
                course_id = course["course_id"]
                course_info = Course.objects(_id=course_id).first()
                cse_weight += course_info.cse_weight
                ceab_math += course_info.ceab_math
                ceab_sci += course_info.ceab_sci
                ceab_eng += course_info.ceab_eng
                ceab_design += course_info.ceab_design
                list_counts[course_info.course_type] += 1
            return {
                "cse_weight": cse_weight,
                "ceab_math": ceab_math,
                "ceab_sci": ceab_sci,
                "ceab_eng": ceab_eng,
                "ceab_design": ceab_design,
                "list_counts": self._format_list_counts(list_counts),
            }
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get CEAB numbers. Reason={reason if reason else str(e)}"
            )
            raise e

    def _format_list_counts(self, list_counts):
        # list count keys are of type CourseType; convert to string for return
        string_keys = [key.value for key in list_counts.keys()]
        return dict(zip(string_keys, list(list_counts.values())))
