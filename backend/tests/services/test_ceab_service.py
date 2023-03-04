import datetime

import pytest
from bson.objectid import ObjectId
from flask import current_app

from app.models.course import ClassType, Course, CourseType, Section, Weekday
from app.models.schedule import Schedule, ScheduleCourses
from app.models.user import User
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
        _id=ObjectId(),
        name="Fundamental Engineering Math 1",
        department="SYDE",
        code="111",
        description="Functions: trigonometric, exponential, log, inverse functions. Differential calculus: limits, continuity, derivatives, differentials, applications. Sequences and series: convergence, power series, Taylor expansions. Simple numerical methods. [Offered: F]",
        ceab_math=42.0,
        sections=[
            Section(
                day=[Weekday.M, Weekday.W],
                term_code="1229",
                start_time=510,
                end_time=590,
                class_number=4877,
                location="E5 6008",
                type=ClassType.LEC,
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
        name="Fundamental Engineering Math 2",
        department="SYDE",
        code="112",
        description="Integration: Indefinite and definite integral; techniques of integration; improper integrals, numerical methods, applications. Vector differential calculus: Partial, total, and directional derivative; Gradient divergence and curl; Jacobian. Applications. [Offered: W, S]",
        ceab_math=42.0,
        sections=[
            Section(
                day=[Weekday.M, Weekday.W],
                term_code="1229",
                start_time=600,
                end_time=680,
                class_number=4977,
                location="E5 6008",
                type=ClassType.LEC,
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
        name="Introduction to Machine Learning",
        department="MSCI",
        code="446",
        description="This course covers algorithmic and statistical foundations of data mining: extracting previously unknown and useful information from data. Topics include exploratory data analysis, data cleaning, data transformations, association rule mining, and both supervised and unsupervised learning. Methods typically covered include, but are not limited to: the Apriori algorithm, Bayesian inference, decision trees, linear and logistic regression, nearest-neighbor classification, and k-means clustering. [Offered: W]",
        ceab_eng_sci=25.2,
        ceab_eng_design=16.8,
        course_type=CourseType.TE,
        sections=[
            Section(
                day=[Weekday.T, Weekday.F],
                term_code="1229",
                start_time=900,
                end_time=980,
                class_number=4900,
                location="E7 4757",
                type=ClassType.LEC,
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
    )
    user.save()


def test_calculate_ceab_numbers_success(ceab_service):
    user = User.objects().first().to_serializable_dict()
    res = ceab_service.get_ceab_numbers(user)
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
