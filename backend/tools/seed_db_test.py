import os
import random
import sys

from app import create_app
from app.models.course import Course
from app.models.schedule import Schedule, ScheduleCourses
from app.models.user import PastCourses, User


def get_random_course_ids(courses, num_courses=3):
    course_oids = set()
    for _ in range(num_courses):
        r_idx = random.randrange(0, len(courses))
        course_oids.add(courses[r_idx].to_serializable_dict()["id"])
    return list(course_oids)


def get_schedule_courses(courses, num_courses=3):
    schedule = []
    # keep looping until we add at least one course to our schedule
    while len(schedule) == 0:
        scheduled_courses = get_random_course_ids(courses, num_courses)
        course_colors = [
            "#ff6961",
            "#ffb480",
            "#e5d54a",
            "#42d6a4",
            "#08cad1",
            "#59adf6",
            "#9d94ff",
            "#c780e8",
        ]

        for course_oid in scheduled_courses:
            course = Course.objects(_id=course_oid).first()
            if course.sections:
                schedule.append(
                    ScheduleCourses(
                        course_id=course_oid,
                        section_id=course.sections[0]._id,
                        color=random.choice(course_colors),
                    )
                )
    return schedule


def add_users():
    print("Seeding users and schedules...")
    courses = Course.objects.all()
    users = [
        User(
            name="Cloud Bread",
            email="breadfydp+cloud@gmail.com",
            grad_year="2023",
            program="SYDE",
            auth_id=os.getenv("TEST_USER_CLOUD_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 1),
        ),
        User(
            name="Hokkaido Milk Bread",
            email="breadfydp+hokkaidomilk@gmail.com ",
            grad_year="2023",
            program="BME",
            auth_id=os.getenv("TEST_USER_HOKKAIDO_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 3),
            past_courses=PastCourses(term_1a=get_random_course_ids(courses, 2)),
        ),
        User(
            name="Melon Bread",
            email="breadfydp+melon@gmail.com ",
            grad_year="2025",
            program="SYDE",
            auth_id=os.getenv("TEST_USER_MELON_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 7),
            past_courses=PastCourses(term_1a=get_random_course_ids(courses, 2)),
        ),
        User(
            name="Egg Bread",
            email="breadfydp+egg@gmail.com ",
            grad_year="2025",
            program="SYDE",
            auth_id=os.getenv("TEST_USER_EGG_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 4),
            past_courses=PastCourses(term_4a=get_random_course_ids(courses, 2)),
        ),
        User(
            name="Brioche Bread",
            email="breadfydp+brioche@gmail.com ",
            grad_year="2027",
            program="BME",
            auth_id=os.getenv("TEST_USER_BRIOCHE_AUTH_ID"),
            saved_courses=get_random_course_ids(courses, 2),
            past_courses=PastCourses(term_1a=get_random_course_ids(courses, 2)),
        ),
    ]
    for user in users:
        schedule = Schedule(
            term="1229", courses=get_schedule_courses(courses, random.randint(1, 5))
        ).save()
        user.schedule = schedule
        user.save()


def clear_database():
    print("Clearing database...")
    User.objects().delete()
    Schedule.objects().delete()
    print("Database cleared 🗑")


def seed_database():
    print("Seeding database...")
    add_users()
    print("Database seeded 🌱")


if __name__ == "__main__":
    app = create_app("development")
    if "clear" in sys.argv:
        clear_database()
    else:
        seed_database()
