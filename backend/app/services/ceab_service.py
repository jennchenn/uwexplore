from enum import Enum

from ..models.course import Course
from ..models.requirement import Requirement
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


DEFAULT_GRAD_YEAR = 2023  # set a default year to base CEAB requirements off of

LABEL_TO_REQ = {
    CeabRequirements.CSE.value: "min_cse",
    CeabRequirements.TE.value: "min_te",
    CeabRequirements.TE_CSE.value: "min_cse_te",
    CeabRequirements.LIST_A.value: "cse_a",
    CeabRequirements.LIST_B.value: "cse_b",
    CeabRequirements.LIST_C.value: "cse_c",
    CeabRequirements.CSE_WEIGHT.value: "cse_weight",
    CeabRequirements.PD_COMP.value: "pd_comp",
    CeabRequirements.PD_ELEC.value: "pd_elec",
    CeabRequirements.MATH.value: "math",
    CeabRequirements.SCI.value: "sci",
    CeabRequirements.ENG_SCI.value: "eng_sci",
    CeabRequirements.ENG_DES.value: "eng_design",
    CeabRequirements.MATH_SCI.value: "min_math_sci",
    CeabRequirements.ENG_SCI_DES.value: "min_eng_sci_des",
}

# https://uwaterloo.ca/engineering/undergraduate-students/co-op-experience/watpd-engineering
COMPULSORY_PD_COURSE_CODES = set(["PD19", "PD20", "PD21"])


class CeabService:
    def __init__(self, logger):
        self.logger = logger

    def get_ceab_numbers_by_user(self, user):
        """
        Calculate CEAB numbers based on user
        :param user: User object to fetch CEAB numbers for
        :type user: dict
        :raise Exception: if error encountered when fetching CEAB numbers or adding them
        """
        try:
            courses = set()

            if user.schedule:
                current_schedule = user.schedule
                for course in current_schedule["courses"]:
                    courses.add(str(course["course_id"]))

            if user.past_courses:
                for term in user.past_courses:
                    past_course_list = user.past_courses[term]
                    for id in past_course_list:
                        courses.add(str(id))

            completed_totals = self._calculate_requirements(courses)
            requirements = self._get_ceab_requirements_by_grad_year(user.grad_year)
            return self._map_totals_requirements(completed_totals, requirements)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get CEAB numbers. Reason={reason if reason else str(e)}"
            )
            raise e

    def get_ceab_numbers_by_schedule(self, schedule_id):
        """
        Calculate CEAB numbers based on provided schedule
        :param schedule_id: ID of schedule to fetch CEAB numbers for
        :type schedule_id: String
        :raise Exception: if error encountered when fetching CEAB numbers or adding them
        """
        try:
            current_schedule = Schedule.objects(id=schedule_id).first()
            courses = set()
            for course in current_schedule["courses"]:
                courses.add(str(course["course_id"]))
            completed_totals = self._calculate_requirements(courses)
            requirements = self._get_ceab_requirements_by_grad_year()
            return self._map_totals_requirements(completed_totals, requirements)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get CEAB numbers. Reason={reason if reason else str(e)}"
            )
            raise e

    def _calculate_requirements(self, courses):
        requirements_counts = {}
        for r in CeabRequirements:
            requirements_counts[r.value] = 0

        for course_id in courses:
            course_info = Course.objects(_id=course_id).first()
            requirements_counts[
                CeabRequirements.CSE_WEIGHT.value
            ] += course_info.cse_weight
            requirements_counts[CeabRequirements.MATH.value] += course_info.ceab_math
            requirements_counts[CeabRequirements.SCI.value] += course_info.ceab_sci
            requirements_counts[
                CeabRequirements.ENG_SCI.value
            ] += course_info.ceab_eng_sci
            requirements_counts[
                CeabRequirements.ENG_DES.value
            ] += course_info.ceab_eng_design
            if course_info.course_type:
                if (
                    course_info.course_type.value == "PD"
                    and course_info.full_code in COMPULSORY_PD_COURSE_CODES
                ):
                    requirements_counts[CeabRequirements.PD_COMP.value] += 1
                elif course_info.course_type.value == "PD":
                    requirements_counts[CeabRequirements.PD_ELEC.value] += 1
                else:
                    requirements_counts[course_info.course_type.value] += 1

        # certain requirements are sum of other ones; compute value in backend for easier parsing in frontend
        self._sum_requirements(requirements_counts)
        self._round_requirements(requirements_counts)
        return requirements_counts

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

    def _get_ceab_requirements_by_grad_year(self, grad_year=DEFAULT_GRAD_YEAR):
        grad_year = DEFAULT_GRAD_YEAR if grad_year is None else int(grad_year)
        requirements = Requirement.objects(grad_year=grad_year).first()
        if not requirements:
            requirements = Requirement.objects(grad_year=DEFAULT_GRAD_YEAR).first()
        return requirements.to_serializable_dict()

    def _map_totals_requirements(self, completed, requirements):
        label_to_completed_totals = {}
        for label, completed in completed.items():
            # for requirements that do not have a total in requirements, use a random key
            requirements_key = LABEL_TO_REQ.get(label, "na")
            label_to_completed_totals[label] = {
                "completed": completed,
                "requirement": requirements.get(requirements_key, "NA"),
            }
        return label_to_completed_totals
