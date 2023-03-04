from enum import Enum

from ..models.course import Course
from ..models.schedule import Schedule


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
    TE_CSE = "TE & CSE"
    MATH_SCI = "MATH & SCI"
    ENG_SCI_DES = "ENG SCI & ENG DES"


class CeabService:
    def __init__(self, logger):
        self.logger = logger

    def get_ceab_numbers(self, user):
        """
        Calculate CEAB numbers based on user
        :param user: User object to fetch CEAB numbers for
        :type user: dict
        :raise Exception: if error encountered when fetching CEAB numbers or adding them
        """
        try:
            requirements_counts = {}
            for r in CeabRequirements:
                requirements_counts[r.value] = 0

            courses = []

            if user.get("schedule"):
                current_schedule_id = user.get("schedule")
                current_schedule = Schedule.objects(id=current_schedule_id).first()
                courses += current_schedule["courses"]

            past_courses = []
            # TODO: add ceab requirements from past courses once implemented
            # past_courses = user.get("past_courses")
            courses += past_courses

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
                if course_info.course_type:
                    requirements_counts[course_info.course_type.value] += 1

            # certain requirements are sum of other ones; compute value in backend for easier parsing in frontend
            self._sum_requirements(requirements_counts)
            self._round_requirements(requirements_counts)
            return requirements_counts
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get CEAB numbers. Reason={reason if reason else str(e)}"
            )
            raise e

    def _sum_requirements(self, requirements_counts):
        requirements_counts[CeabRequirements.TE_CSE.value] = (
            requirements_counts[CeabRequirements.TE.value]
            + requirements_counts[CeabRequirements.CSE.value]
        )
        requirements_counts[CeabRequirements.MATH_SCI.value] = (
            requirements_counts[CeabRequirements.MATH.value]
            + requirements_counts[CeabRequirements.SCI.value]
        )
        requirements_counts[CeabRequirements.ENG_SCI_DES.value] = (
            requirements_counts[CeabRequirements.ENG_SCI.value]
            + requirements_counts[CeabRequirements.ENG_DES.value]
        )

    def _round_requirements(self, requirements_counts):
        # Python float addition sometimes adds lots of decimals - round this before returning
        for req, value in requirements_counts.items():
            requirements_counts[req] = round(value, 2)
