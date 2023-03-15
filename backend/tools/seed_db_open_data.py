import datetime
import os
import sys

import requests

from app import create_app
from app.models.course import Course, Section, Weekday

API_KEY = os.getenv("OPENDATA_API_KEY")
API_PATH = os.getenv("OPENDATA_API_PATH", "https://openapi.data.uwaterloo.ca/v3/")
HEADER = {"x-api-key": API_KEY, "accept": "application/json"}


def _make_request(path):
    response = requests.get(API_PATH + path, headers=HEADER)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"{response.status_code} error with your request")


def get_term_for_academic_year(year):
    return _make_request(f"Terms/foracademicyear/{year}")


def _get_current_year():
    currentDateTime = datetime.datetime.now()
    date = currentDateTime.date()
    year = date.strftime("%Y")
    return int(year)


def get_six_terms_data():
    # An academic year is Spring [Year-1], Fall [Year-1], Winter [Year]
    return get_term_for_academic_year(_get_current_year()) + get_term_for_academic_year(
        _get_current_year() - 1
    )


def _get_courses_by_term(code):
    return _make_request(f"Courses/{code}")


def get_courses(terms):
    courses = []
    for term in terms:
        courses += _get_courses_by_term(term["termCode"])
    return courses


def _get_mseconds_since_start(dt):
    # online class start and end times come as 0001-01-01 00:00:00
    if dt.date().year == 1:
        return None
    day = (
        datetime.datetime(
            dt.date().year,
            dt.date().month,
            dt.date().day,
        ).timestamp()
        * 1000
    )
    timestamp = dt.timestamp() * 1000
    return timestamp - day


def insert_courses(courses):
    exceptions = []
    for course in courses:
        try:
            if Course.objects(course_id=course["courseId"]).first():
                continue

            Course(
                name=course["title"],
                department=course["subjectCode"],
                code=course["catalogNumber"],
                full_code=course["subjectCode"] + course["catalogNumber"],
                course_id=course["courseId"],
                description=course["description"],
                description_abbreviated=course["descriptionAbbreviated"],
            ).save()
            print(f"Inserted {course['subjectCode']} {course['catalogNumber']}")
        except Exception as e:
            print(
                f"Error inserting {course['subjectCode']} {course['catalogNumber']}: {e}"
            )
            exceptions.append(f"{course['subjectCode']} {course['catalogNumber']}: {e}")
    return exceptions


def _get_class_schedule_term_class_code(term, course_id):
    return _make_request(f"ClassSchedules/{term}/{course_id}")


def _get_class_schedule_by_term(term):
    return _make_request(f"ClassSchedules/{term}")


def insert_schedules(terms, skip_update=False):
    for term in terms:
        courses = _get_class_schedule_by_term(term["termCode"])
        term_name = term["name"]
        exceptions = []
        for course in courses:
            schedule = _get_class_schedule_term_class_code(term["termCode"], course)
            course_object = Course.objects(course_id=course).first()
            if (
                not course_object
            ):  # if we don't have the course, we cannot add the section
                exceptions.append(f"Missing course with id={course}")
                continue
            # if skip_update=True, avoid updating courses with section already declared
            if skip_update and course_object.sections:
                continue
            sections = []
            for s in schedule:
                try:
                    course_type = s["courseComponent"]
                    enrolled_number = s["enrolledStudents"]
                    capacity = s["maxEnrollmentCapacity"]
                    term_code = s["termCode"]
                    class_number = int(s["classNumber"])
                    class_section = str(s["classSection"])

                    if s["scheduleData"]:
                        for i, schedule_details in enumerate(s["scheduleData"]):
                            schedule_start = datetime.datetime.strptime(
                                schedule_details["scheduleStartDate"],
                                "%Y-%m-%dT%H:%M:%S",
                            )
                            schedule_end = datetime.datetime.strptime(
                                schedule_details["scheduleEndDate"], "%Y-%m-%dT%H:%M:%S"
                            )
                            start_time = datetime.datetime.strptime(
                                schedule_details["classMeetingStartTime"],
                                "%Y-%m-%dT%H:%M:%S",
                            )
                            end_time = datetime.datetime.strptime(
                                schedule_details["classMeetingEndTime"],
                                "%Y-%m-%dT%H:%M:%S",
                            )

                            start_time_ms = _get_mseconds_since_start(start_time)
                            end_time_ms = _get_mseconds_since_start(end_time)

                            meeting_days = schedule_details[
                                "classMeetingDayPatternCode"
                            ]  # MW
                            location = schedule_details["locationName"]
                            if s["instructorData"]:
                                instructor_data = s["instructorData"][i]
                                instructor = f"{instructor_data['instructorFirstName']} {instructor_data['instructorLastName']}"
                            else:
                                instructor = None
                            days = [Weekday(d).name for d in meeting_days]
                            sections.append(
                                Section(
                                    course_id=course_object._id,
                                    day=days,
                                    term_code=term_code,
                                    term_name=term_name,
                                    instructor=instructor,
                                    start_time=start_time_ms,
                                    end_time=end_time_ms,
                                    class_number=class_number,
                                    location=location,
                                    type=course_type,
                                    number=class_section,
                                    start_date=schedule_start,
                                    end_date=schedule_end,
                                    enrolled_number=enrolled_number,
                                    capacity=capacity,
                                )
                            )
                except Exception as e:
                    print(
                        f"Error for {course_object['department']} {course_object['code']}: {e}"
                    )
                    exceptions.append(
                        f"Error for {course_object['department']} {course_object['code']}: {e}"
                    )
            try:
                course_object.sections = sections
                course_object.save()
                print(
                    f"Inserted section for {course_object['department']} {course_object['code']}"
                )
            except Exception as e:
                print(
                    f"Error for {course_object['department']} {course_object['code']}: {e}"
                )
    return exceptions


def _get_current_term():
    return _make_request("Terms/current")


# Helper function to remove all the sections from courses
def _clear_sections():
    for c in Course.objects.order_by("-sections"):
        if c.sections:
            print(f"Deleting schedule for {c.name}")
            del c.sections
            c.save()


def update_current_term_data(clear_sections=False):
    if clear_sections:
        _clear_sections()
    current_term = _get_current_term()
    courses = get_courses([current_term])
    insert_course_exceptions = insert_courses(courses)
    insert_schedule_exceptions = insert_schedules([current_term])
    return {
        "course_exceptions": insert_course_exceptions,
        "schedule_exceptions": insert_schedule_exceptions,
    }


def update_six_terms_data():
    terms = get_six_terms_data()
    courses = get_courses(terms)
    insert_course_exceptions = insert_courses(courses)
    insert_schedule_exceptions = insert_schedules(terms)
    return {
        "course_exceptions": insert_course_exceptions,
        "schedule_exceptions": insert_schedule_exceptions,
    }


def update_database(update_current=True):
    if update_current:
        print("Updating data for current term...")
        res = update_current_term_data()
        print(res)
    else:
        print("Adding data from past two academic years...")
        res = update_six_terms_data()
        print(res)


def clear_database():
    print("Clearing database...")
    Course.objects().delete()
    print("Database cleared 🗑")


if __name__ == "__main__":
    app = create_app("development")
    if "clear" in sys.argv:
        clear_database()
    else:
        update_database()
