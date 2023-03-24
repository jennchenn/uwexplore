import datetime

import pytest
from bson.objectid import ObjectId
from flask import current_app

from app.models.course import Course, Section
from app.models.requirement import Requirement
from app.models.schedule import Schedule, ScheduleCourses
from app.models.user import PastCourses, User
from app.services.ceab_service import CeabService


@pytest.fixture
def ceab_service():
    ceab_service = CeabService(current_app.logger)
    seed_database()
    yield ceab_service
    User.objects.delete()
    Schedule.objects.delete()
    Course.objects.delete()
    Requirement.objects.delete()


DEFAULT_COURSES = [
    Course(
        _id=ObjectId(),
        course_id="1234",
        name="Fundamental Engineering Math 1",
        department="SYDE",
        code="111",
        full_code="SYDE111",
        description="Functions: trigonometric, exponential, log, inverse functions. Differential calculus: limits, continuity, derivatives, differentials, applications. Sequences and series: convergence, power series, Taylor expansions. Simple numerical methods. [Offered: F]",
        ceab_math=42.0,
        sections=[
            Section(
                day=["MONDAY", "WEDNESDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=510,
                end_time=590,
                class_number=4877,
                location="E5 6008",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
            ),
            Section(
                day=["SATURDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=510,
                end_time=590,
                class_number=4877,
                location="E5 6008",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
            ),
        ],
    ),
    Course(
        _id=ObjectId(),
        course_id="23456",
        name="Fundamental Engineering Math 2",
        department="SYDE",
        code="112",
        full_code="SYDE112",
        description="Integration: Indefinite and definite integral; techniques of integration; improper integrals, numerical methods, applications. Vector differential calculus: Partial, total, and directional derivative; Gradient divergence and curl; Jacobian. Applications. [Offered: W, S]",
        ceab_math=42.0,
        sections=[
            Section(
                day=["MONDAY", "WEDNESDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=600,
                end_time=680,
                class_number=4977,
                location="E5 6008",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
            ),
            Section(
                day=["SATURDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=600,
                end_time=680,
                class_number=4977,
                location="E5 6008",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
            ),
        ],
    ),
    Course(
        _id=ObjectId(),
        course_id="56789",
        name="Introduction to Machine Learning",
        department="MSCI",
        code="446",
        full_code="MSCI446",
        description="This course covers algorithmic and statistical foundations of data mining: extracting previously unknown and useful information from data. Topics include exploratory data analysis, data cleaning, data transformations, association rule mining, and both supervised and unsupervised learning. Methods typically covered include, but are not limited to: the Apriori algorithm, Bayesian inference, decision trees, linear and logistic regression, nearest-neighbor classification, and k-means clustering. [Offered: W]",
        ceab_eng_sci=25.2,
        ceab_eng_design=16.8,
        course_type="TE",
        sections=[
            Section(
                day=["TUESDAY", "FRIDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=900,
                end_time=980,
                class_number=4900,
                location="E7 4757",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=120,
                capacity=120,
            ),
            Section(
                day=["SATURDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=900,
                end_time=980,
                class_number=4900,
                location="E7 4757",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=120,
                capacity=120,
            ),
        ],
    ),
]


DEFAULT_PAST_COURSES = [
    Course(
        _id=ObjectId(),
        course_id="12345",
        name="Fundamental Engineering Math 1",
        department="SYDE",
        code="411",
        full_code="SYDE411",
        description="Functions: trigonometric, exponential, log, inverse functions. Differential calculus: limits, continuity, derivatives, differentials, applications. Sequences and series: convergence, power series, Taylor expansions. Simple numerical methods. [Offered: F]",
        ceab_math=42.0,
        sections=[
            Section(
                day=["MONDAY", "WEDNESDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=510,
                end_time=590,
                class_number=4877,
                location="E5 6008",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
            ),
            Section(
                day=["SATURDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=510,
                end_time=590,
                class_number=4877,
                location="E5 6008",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
            ),
        ],
    ),
    Course(
        _id=ObjectId(),
        course_id="234565",
        name="Fundamental Engineering Math 2",
        department="SYDE",
        code="412",
        full_code="SYDE412",
        description="Integration: Indefinite and definite integral; techniques of integration; improper integrals, numerical methods, applications. Vector differential calculus: Partial, total, and directional derivative; Gradient divergence and curl; Jacobian. Applications. [Offered: W, S]",
        ceab_math=42.0,
        sections=[
            Section(
                day=["MONDAY", "WEDNESDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=600,
                end_time=680,
                class_number=4977,
                location="E5 6008",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
            ),
            Section(
                day=["SATURDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=600,
                end_time=680,
                class_number=4977,
                location="E5 6008",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
            ),
        ],
    ),
    Course(
        _id=ObjectId(),
        course_id="567895",
        name="Introduction to Machine Learning",
        department="MSCI",
        code="646",
        full_code="MSCI646",
        description="This course covers algorithmic and statistical foundations of data mining: extracting previously unknown and useful information from data. Topics include exploratory data analysis, data cleaning, data transformations, association rule mining, and both supervised and unsupervised learning. Methods typically covered include, but are not limited to: the Apriori algorithm, Bayesian inference, decision trees, linear and logistic regression, nearest-neighbor classification, and k-means clustering. [Offered: W]",
        ceab_eng_sci=25.2,
        ceab_eng_design=16.8,
        course_type="TE",
        sections=[
            Section(
                day=["TUESDAY", "FRIDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=900,
                end_time=980,
                class_number=4900,
                location="E7 4757",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=120,
                capacity=120,
            ),
            Section(
                day=["SATURDAY"],
                term_code="1229",
                term_name="Spring 2022",
                course_id=ObjectId(),
                start_time=900,
                end_time=980,
                class_number=4900,
                location="E7 4757",
                type="LEC",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=120,
                capacity=120,
            ),
        ],
    ),
]


def seed_database():
    User.objects.delete()
    Schedule.objects.delete()
    Course.objects.delete()
    course_ids = []
    for course in DEFAULT_COURSES:
        course.save()
        course_ids.append(course._id)

    past_course_ids = []
    for course in DEFAULT_PAST_COURSES:
        course.save()
        past_course_ids.append(course._id)

    schedule_courses = []
    for course_oid in course_ids:
        sections = Course.objects(_id=course_oid).first().sections
        for section in sections:
            schedule_courses.append(
                ScheduleCourses(
                    course_id=course_oid,
                    section_id=section._id,
                    color="#ff6961",
                )
            )

    schedule = Schedule(term="1229", courses=schedule_courses).save()
    user = User(
        name="Test Bread",
        email="breadfydp+test@gmail.com",
        grad_year="2023",
        program="SYDE",
        auth_id="auth",
        schedule=schedule,
        past_courses=PastCourses(term_1a=past_course_ids),
    )
    user.save()
    Requirement(
        grad_year=2023,
        cse_a=1,
        cse_b=1,
        cse_c=2,
        min_cse=6,
        min_te=6,
        min_cse_te=13,
        cse_weight=225,
        math=195,
        sci=195,
        eng_sci=225,
        eng_design=225,
        min_math_sci=420,
        min_eng_sci_des=900,
        pd_comp=2,
        pd_elec=3,
    ).save()


def test_calculate_ceab_numbers_for_user_success(ceab_service):
    user = User.objects().first()
    res = ceab_service.get_ceab_numbers_by_user(user)
    # TODO: shouldn't hardcode these
    assert res == {
        "CSE ALL": {"completed": 0, "requirement": 6},
        "CSE WEIGHT": {"completed": 0.0, "requirement": 225},
        "ENG DES": {"completed": 33.6, "requirement": 225},
        "ENG SCI": {"completed": 50.4, "requirement": 225},
        "ENG SCI & ENG DES": {"completed": 84.0, "requirement": 900},
        "LIST A": {"completed": 0, "requirement": 1},
        "LIST B": {"completed": 0, "requirement": 1},
        "LIST C": {"completed": 0, "requirement": 2},
        "LIST D": {"completed": 0, "requirement": "NA"},
        "MATH": {"completed": 168.0, "requirement": 195},
        "MATH & SCI": {"completed": 168.0, "requirement": 420},
        "PD COMP": {"completed": 0, "requirement": 2},
        "PD ELEC": {"completed": 0, "requirement": 3},
        "SCI": {"completed": 0.0, "requirement": 195},
        "TE": {"completed": 2, "requirement": 6},
        "TE & CSE": {"completed": 2, "requirement": 13},
    }


def test_calculate_ceab_numbers_by_schedule_success(ceab_service):
    schedule = Schedule.objects().first().to_serializable_dict()
    res = ceab_service.get_ceab_numbers_by_schedule(schedule["id"])
    # TODO: shouldn't hardcode these
    assert res == {
        "CSE ALL": {"completed": 0, "requirement": 6},
        "CSE WEIGHT": {"completed": 0.0, "requirement": 225},
        "ENG DES": {"completed": 16.8, "requirement": 225},
        "ENG SCI": {"completed": 25.2, "requirement": 225},
        "ENG SCI & ENG DES": {"completed": 42.0, "requirement": 900},
        "LIST A": {"completed": 0, "requirement": 1},
        "LIST B": {"completed": 0, "requirement": 1},
        "LIST C": {"completed": 0, "requirement": 2},
        "LIST D": {"completed": 0, "requirement": "NA"},
        "MATH": {"completed": 84.0, "requirement": 195},
        "MATH & SCI": {"completed": 84.0, "requirement": 420},
        "PD COMP": {"completed": 0, "requirement": 2},
        "PD ELEC": {"completed": 0, "requirement": 3},
        "SCI": {"completed": 0.0, "requirement": 195},
        "TE": {"completed": 1, "requirement": 6},
        "TE & CSE": {"completed": 1, "requirement": 13},
    }
