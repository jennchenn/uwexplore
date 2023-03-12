import datetime

import pytest
from bson.objectid import ObjectId
from flask import current_app

from app.models.course import Course, Section
from app.services.course_service import CourseService


@pytest.fixture
def course_service():
    course_service = CourseService(current_app.logger)
    seed_database()
    yield course_service
    Course.objects.delete()


DEFAULT_COURSES = [
    Course(
        name="Fundamental Engineering Math 1",
        department="SYDE",
        code="111",
        description="Functions: trigonometric, exponential, log, inverse functions. Differential calculus: limits, continuity, derivatives, differentials, applications. Sequences and series: convergence, power series, Taylor expansions. Simple numerical methods. [Offered: F]",
        ceab_math=42.0,
        course_id="5678",
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
        course_id="1234",
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
    Course.objects.delete()
    for course in DEFAULT_COURSES:
        course.save()


def test_get_courses_success(course_service):
    res = course_service.get_courses()
    assert type(res) is list
    assert len(res) == len(DEFAULT_COURSES)
    returned_names = set()
    for c in res:
        returned_names.add(c["name"])
    for c in DEFAULT_COURSES:
        assert c.name in returned_names
