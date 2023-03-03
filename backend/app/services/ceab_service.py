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
    CSE_WEIGHT = "CSE WEIGHT"
    REQUIRED = "REQUIRED"


class CeabService:
    def __init__(self, logger):
        self.logger = logger

    def get_ceab_numbers(self, user):
        try:
            requirements_counts = {}
            for r in CeabRequirements:
                requirements_counts[r.value] = 0
            current_schedule = user.get("schedule")
            past_courses = []
            # TODO: add ceab requirements from past courses once implemented
            # past_courses = user.get("past_courses")
            courses = current_schedule["courses"] + past_courses

            for course in courses:
                course_id = course["course_id"]
                course_info = Course.objects(_id=course_id).first()
                requirements_counts[
                    CeabRequirements.CSE_WEIGHT.value
                ] += course_info.cse_weight
                requirements_counts[
                    CeabRequirements.MATH.value
                ] += course_info.ceab_math
                requirements_counts[CeabRequirements.SCI.value] += course_info.ceab_sci
                requirements_counts[
                    CeabRequirements.ENG_SCI.value
                ] += course_info.ceab_eng_sci
                requirements_counts[
                    CeabRequirements.ENG_DES.value
                ] += course_info.ceab_eng_design
                requirements_counts[course_info.course_type.value] += 1
            return requirements_counts
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get CEAB numbers. Reason={reason if reason else str(e)}"
            )
            raise e
