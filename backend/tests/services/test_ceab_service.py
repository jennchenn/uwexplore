import datetime

import pytest
from bson.objectid import ObjectId
from flask import current_app

from app.models.course import Course, Section
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


DEFAULT_COURSES = [
    Course(
        name="Fundamental Engineering Math 1",
        department="SYDE",
        code="111",
        description="Functions: trigonometric, exponential, log, inverse functions. Differential calculus: limits, continuity, derivatives, differentials, applications. Sequences and series: convergence, power series, Taylor expansions. Simple numerical methods. [Offered: F]",
        ceab_math=42.0,
        course_id="000002",
        sections=[
            Section(
                day=["MONDAY", "WEDNESDAY"],
                term_code="1229",
                term_name="Spring 2022",
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
                course_id=ObjectId(),
            ),
            Section(
                day=["TUESDAY", "THURSDAY"],
                term_code="1229",
                term_name="Spring 2022",
                start_time=510,
                end_time=590,
                class_number=4878,
                location="E5 6008",
                type="LEC",
                number="002",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
                course_id=ObjectId(),
            ),
            Section(
                day=["FRIDAY"],
                term_code="1229",
                term_name="Spring 2022",
                start_time=510,
                end_time=560,
                class_number=4879,
                location="E5 6008",
                type="TUT",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
                course_id=ObjectId(),
            ),
        ],
    ),
    Course(
        name="Fundamental Engineering Math 2",
        department="SYDE",
        code="112",
        description="Integration: Indefinite and definite integral; techniques of integration; improper integrals, numerical methods, applications. Vector differential calculus: Partial, total, and directional derivative; Gradient divergence and curl; Jacobian. Applications. [Offered: W, S]",
        ceab_math=42.0,
        course_id="000003",
        sections=[
            Section(
                day=["MONDAY", "WEDNESDAY"],
                term_code="1229",
                term_name="Spring 2022",
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
                course_id=ObjectId(),
            ),
            Section(
                day=["TUESDAY", "TUESDAY"],
                term_code="1229",
                term_name="Spring 2022",
                start_time=600,
                end_time=680,
                class_number=4978,
                location="E5 6008",
                type="LEC",
                number="002",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
                course_id=ObjectId(),
            ),
            Section(
                day=["FRIDAY"],
                term_code="1229",
                term_name="Spring 2022",
                start_time=600,
                end_time=650,
                class_number=4979,
                location="E5 6008",
                type="TUT",
                number="001",
                start_date=datetime.datetime(2023, 9, 7),
                end_date=datetime.datetime(2023, 12, 17),
                enrolled_number=102,
                capacity=102,
                course_id=ObjectId(),
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
        course_ids.append(str(course._id))
    schedule_courses = []
    for course_oid in course_ids:
        schedule_courses.append(
            ScheduleCourses(
                course_id=course_oid,
                section_id=Course.objects(_id=course_oid).first().sections[0]._id,
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
        past_courses=PastCourses(term_1a=course_ids),
    )
    user.save()


def test_calculate_ceab_numbers_for_user_success(ceab_service):
    user = User.objects().first().to_serializable_dict()
    res = ceab_service.get_ceab_numbers_by_user(user)
    # TODO: shouldn't hardcode these
    assert res == {
        "CSE ALL": 0,
        "CSE WEIGHT": 0.0,
        "ENG DES": 33.6,
        "ENG SCI": 50.4,
        "LIST A": 0,
        "LIST B": 0,
        "LIST C": 0,
        "LIST D": 0,
        "MATH": 168.0,
        "PD COMP": 0,
        "PD ELEC": 0,
        "SCI": 0.0,
        "TE": 2,
        "TE & CSE": 2,
        "MATH & SCI": 168.0,
        "ENG SCI & ENG DES": 84.0,
    }


def test_calculate_ceab_numbers_by_schedule_success(ceab_service):
    schedule = Schedule.objects().first().to_serializable_dict()
    res = ceab_service.get_ceab_numbers_by_schedule(schedule["id"])
    # TODO: shouldn't hardcode these
    assert res == {
        "CSE ALL": 0,
        "CSE WEIGHT": 0.0,
        "ENG DES": 16.8,
        "ENG SCI": 25.2,
        "LIST A": 0,
        "LIST B": 0,
        "LIST C": 0,
        "LIST D": 0,
        "MATH": 84.0,
        "PD COMP": 0,
        "PD ELEC": 0,
        "SCI": 0.0,
        "TE": 1,
        "TE & CSE": 1,
        "MATH & SCI": 84.0,
        "ENG SCI & ENG DES": 42.0,
    }
