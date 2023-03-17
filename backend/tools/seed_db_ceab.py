import csv

from app import create_app
from app.models.course import Course, CourseType
from app.models.requirement import Requirement


def update_database():
    update_course_requirements()
    # update_ceab_totals()


def update_course_requirements():
    # define sheet columns
    PROGRAM = 1
    CODE = 2
    LIST = 5
    MATH = 6
    SCI = 7
    ENG_SCI = 8
    ENG_DES = 9
    CSE_WEIGHT = 10

    exceptions = []

    list_to_enum = {
        "A": CourseType.LIST_A.value,
        "B": CourseType.LIST_B.value,
        "C": CourseType.LIST_C.value,
        "D": CourseType.LIST_D.value,
        "TE": CourseType.TE.value,
        "PD": CourseType.PD.value,
    }

    with open("tools/data/courses.csv", "r") as courses:
        courses_reader = csv.reader(courses)
        next(courses_reader, None)  # skip parsing header

        for course in courses_reader:
            full_course_code = course[PROGRAM] + course[CODE]
            course_object = Course.objects(full_code=full_course_code).first()
            if (
                not course_object
            ):  # if we don't have the course, we cannot add the requirements
                exceptions.append(f"Missing course={full_course_code}")
                continue
            try:
                course_object.cse_weight = float(course[CSE_WEIGHT])
                course_object.ceab_math = float(course[MATH])
                course_object.ceab_sci = float(course[SCI])
                course_object.ceab_eng_sci = float(course[ENG_SCI])
                course_object.ceab_eng_design = float(course[ENG_DES])
                if course[LIST] != "":
                    course_object.course_type = list_to_enum[course[LIST]]
                course_object.save()
                print(f"Inserted CEAB requirements for course={full_course_code}")
            except Exception as e:
                print(f"Error for {full_course_code}: {e}")
                exceptions.append(
                    f"Error for {course_object['department']} {course_object['code']}: {e}"
                )
    print(exceptions)


def update_ceab_totals():
    GRAD_YEAR = 0
    CSE_A = 2
    CSE_B = 3
    CSE_C = 4
    MIN_CSE = 6
    MIN_TE = 7
    MIN_CSE_TE = 8
    CSE_WEIGHT = 9
    MATH = 10
    SCI = 11
    ENG_SCI = 12
    ENG_DES = 13
    MIN_MATH_SCI = 14
    MIN_ENG_SCI_DES = 15
    PD_COMP = 16
    PD_ELEC = 17

    with open("tools/data/requirements.csv", "r") as requirements:
        requirements_reader = csv.reader(requirements)
        next(requirements_reader, None)  # skip parsing header

        for requirement in requirements_reader:
            Requirement(
                grad_year=int(requirement[GRAD_YEAR]),
                cse_a=int(requirement[CSE_A]),
                cse_b=int(requirement[CSE_B]),
                cse_c=int(requirement[CSE_C]),
                min_cse=int(requirement[MIN_CSE]),
                min_te=int(requirement[MIN_TE]),
                min_cse_te=int(requirement[MIN_CSE_TE]),
                cse_weight=int(requirement[CSE_WEIGHT]),
                math=int(requirement[MATH]),
                sci=int(requirement[SCI]),
                eng_sci=int(requirement[ENG_SCI]),
                eng_design=int(requirement[ENG_DES]),
                min_math_sci=int(requirement[MIN_MATH_SCI]),
                min_eng_sci_des=int(requirement[MIN_ENG_SCI_DES]),
                pd_comp=int(requirement[PD_COMP]),
                pd_elec=int(requirement[PD_ELEC]),
            ).save()


if __name__ == "__main__":
    app = create_app("development")
    update_database()
