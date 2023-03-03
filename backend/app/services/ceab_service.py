from collections import defaultdict
from enum import Enum

from ..models.course import Course


class CeabRequirements(Enum):
    TE = "TE"
    LIST_A = "LIST A"
    LIST_B = "LIST B"
    LIST_C = "LIST C"
    LIST_D = "LIST D"
    CSE = "CSE ALL"
    PD_COMP = "PD COMP"
    PD_ELEC = "PD ELEC"
    MATH = "MATH"
    SCI = "SCI"
    ENG_SCI = "ENG SCI"
    ENG_DES = "ENG DES"
    TE_CSE = "TE & CSE"
    MATH_SCI = "MATH & SCI"
    ENG_SCI_DES = "ENG SCI & ENG DES"
    CSE_WEIGHT = "CSE WEIGHT"


class CeabService:
    def __init__(self, logger):
        self.logger = logger

    def get_ceab_numbers(self, user):
        try:
            requirements_counts = defaultdict(lambda: 0)
            current_schedule = user.get("schedule")
            past_courses = []
            # TODO: add ceab requirements from past courses once implemented
            # past_courses = user.get("past_courses")
            courses = current_schedule["courses"] + past_courses

            for course in courses:
                course_id = course["course_id"]
                course_info = Course.objects(_id=course_id).first()
                requirements_counts[
                    CeabRequirements.CSE_WEIGHT
                ] += course_info.cse_weight
                requirements_counts[CeabRequirements.MATH] += course_info.ceab_math
                requirements_counts[CeabRequirements.SCI] += course_info.ceab_sci
                requirements_counts[
                    CeabRequirements.ENG_SCI
                ] += course_info.ceab_eng_sci
                requirements_counts[
                    CeabRequirements.ENG_DES
                ] += course_info.ceab_eng_design
                requirements_counts[course_info.course_type] += 1
            return self._format_dict(requirements_counts)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get CEAB numbers. Reason={reason if reason else str(e)}"
            )
            raise e

    def _format_dict(self, requirements_counts):
        # list count keys are of type CeabRequirements; convert to string for return
        string_keys = [key.value for key in requirements_counts.keys()]
        return dict(zip(string_keys, list(requirements_counts.values())))
