import datetime
import os
import sys
from enum import Enum

import requests

from app import create_app
from app.models.course import Course, Section, Weekday

API_KEY = os.getenv("OPENDATA_API_KEY")
API_PATH = os.getenv("OPENDATA_API_PATH", "https://openapi.data.uwaterloo.ca/v3/")
HEADER = {"x-api-key": API_KEY, "accept": "application/json"}


class Season(Enum):
    FALL = "F"
    WINTER = "W"
    SPRING = "S"


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
    # return get_term_for_academic_year(_get_current_year()) + get_term_for_academic_year(
    #     _get_current_year() - 1
    # )
    return get_term_for_academic_year(_get_current_year())
    # {
    #   "termCode": "1221",
    #   "name": "Winter 2022",
    #   "nameShort": "2022 W",
    #   "termBeginDate": "2022-01-01T00:00:00",
    #   "termEndDate": "2022-04-30T00:00:00",
    #   "sixtyPercentCompleteDate": "2022-02-01T00:00:00",
    #   "associatedAcademicYear": 2022,
    # }


def _get_courses_by_term(code):
    return _make_request(f"Courses/{code}")


def get_courses(terms):
    courses = []
    for term in terms:
        courses += _get_courses_by_term(term["termCode"])
    return courses
    # {
    #     "courseId": "016521",
    #     "courseOfferNumber": 1,
    #     "termCode": "1225",
    #     "termName": "Spring 2022",
    #     "associatedAcademicCareer": "GRD",
    #     "associatedAcademicGroupCode": "VPA",
    #     "associatedAcademicOrgCode": "VPA",
    #     "subjectCode": "AVIA",
    #     "catalogNumber": "602",
    #     "title": "Interdisciplinary Aeronautics Project",
    #     "descriptionAbbreviated": "Aeronautics Project",
    #     "description": "This course builds upon AVIA 601, assigning multidisciplinary student groups contemporary challenges in the air transport sector. Student groups will have the opportunity to explore their issues through field trips, industry mentors, and support from interdisciplinary faculty members. The culmination of the group project will be a written report and presentation summarizing their investigation into the aeronautical issue.",
    #     "gradingBasis": "NUM",
    #     "courseComponentCode": "SEM",
    #     "enrollConsentCode": "I",
    #     "enrollConsentDescription": "No Consent Required",
    #     "dropConsentCode": "N",
    #     "dropConsentDescription": "No Consent Required",
    #     "requirementsDescription": None,
    # }, {
    #     "courseId": "016522",
    #     "courseOfferNumber": 1,
    #     "termCode": "1225",
    #     "termName": "Spring 2022",
    #     "associatedAcademicCareer": "GRD",
    #     "associatedAcademicGroupCode": "VPA",
    #     "associatedAcademicOrgCode": "VPA",
    #     "subjectCode": "AVIA",
    #     "catalogNumber": "802",
    #     "title": "Interdisciplinary Aeronautics Project - PhD Level",
    #     "descriptionAbbreviated": "Aeronautics Project",
    #     "description": "This course builds upon AVIA 601, assigning multidisciplinary student groups contemporary challenges in the air transport sector. Student groups will have the opportunity to explore their issues through field trips, industry mentors, and support from interdisciplinary faculty members. The culmination of the group project will be a written report and presentation summarizing their investigation into the aeronautical issue. This offering is intended for students at the PhD level.",
    #     "gradingBasis": "NUM",
    #     "courseComponentCode": "SEM",
    #     "enrollConsentCode": "I",
    #     "enrollConsentDescription": "No Consent Required",
    #     "dropConsentCode": "N",
    #     "dropConsentDescription": "No Consent Required",
    #     "requirementsDescription": None,
    # }


def _get_mseconds_since_start(dt):
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
                    print(e)
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


# CS 445
# [
#     {
#         "courseId": "004413",
#         "courseOfferNumber": 1,
#         "sessionCode": "1",
#         "classSection": 1,
#         "termCode": "1231",
#         "classNumber": 6028,
#         "courseComponent": "LEC",
#         "associatedClassCode": 0,
#         "maxEnrollmentCapacity": 75,
#         "enrolledStudents": 69,
#         "enrollConsentCode": "I",
#         "enrollConsentDescription": "No Consent Required",
#         "dropConsentCode": "N",
#         "dropConsentDescription": "No Consent Required",
#         "scheduleData": [
#             {
#                 "courseId": "004413",
#                 "courseOfferNumber": 1,
#                 "sessionCode": "1",
#                 "classSection": 1,
#                 "termCode": "1231",
#                 "classMeetingNumber": 1,
#                 "scheduleStartDate": "2023-01-09T00:00:00",
#                 "scheduleEndDate": "2023-04-10T00:00:00",
#                 "classMeetingStartTime": "2023-03-06T14:30:00",
#                 "classMeetingEndTime": "2023-03-06T15:50:00",
#                 "classMeetingDayPatternCode": "TR",
#                 "classMeetingWeekPatternCode": "NYNYNNN",
#                 "locationName": "MC 4059",
#             }
#         ],
#         "instructorData": [
#             {
#                 "courseId": "004413",
#                 "courseOfferNumber": 1,
#                 "sessionCode": "1",
#                 "classSection": 1,
#                 "termCode": "1231",
#                 "instructorRoleCode": "PI",
#                 "instructorFirstName": "Victoria",
#                 "instructorLastName": "Sakhnini",
#                 "instructorUniqueIdentifier": "6E3E59FEAF580F0FF874DA3F515646C611FCFFF1E1E2F4DDC01ED7108D00076D",
#                 "classMeetingNumber": 1,
#             }
#         ],
#     },
#     {
#         "courseId": "004413",
#         "courseOfferNumber": 1,
#         "sessionCode": "1",
#         "classSection": 101,
#         "termCode": "1231",
#         "classNumber": 6029,
#         "courseComponent": "TUT",
#         "associatedClassCode": 0,
#         "maxEnrollmentCapacity": 75,
#         "enrolledStudents": 69,
#         "enrollConsentCode": "N",
#         "enrollConsentDescription": "No Consent Required",
#         "dropConsentCode": "N",
#         "dropConsentDescription": "No Consent Required",
#         "scheduleData": [
#             {
#                 "courseId": "004413",
#                 "courseOfferNumber": 1,
#                 "sessionCode": "1",
#                 "classSection": 101,
#                 "termCode": "1231",
#                 "classMeetingNumber": 1,
#                 "scheduleStartDate": "2023-01-09T00:00:00",
#                 "scheduleEndDate": "2023-04-10T00:00:00",
#                 "classMeetingStartTime": "2023-03-06T16:00:00",
#                 "classMeetingEndTime": "2023-03-06T17:20:00",
#                 "classMeetingDayPatternCode": "M",
#                 "classMeetingWeekPatternCode": "YNNNNNN",
#                 "locationName": "MC 4045",
#             }
#         ],
#         "instructorData": [
#             {
#                 "courseId": "004413",
#                 "courseOfferNumber": 1,
#                 "sessionCode": "1",
#                 "classSection": 101,
#                 "termCode": "1231",
#                 "instructorRoleCode": "PI",
#                 "instructorFirstName": "Victoria",
#                 "instructorLastName": "Sakhnini",
#                 "instructorUniqueIdentifier": "6E3E59FEAF580F0FF874DA3F515646C611FCFFF1E1E2F4DDC01ED7108D00076D",
#                 "classMeetingNumber": 1,
#             }
#         ],
#     },
#     {
#         "courseId": "004413",
#         "courseOfferNumber": 2,
#         "sessionCode": "1",
#         "classSection": 1,
#         "termCode": "1231",
#         "classNumber": 4822,
#         "courseComponent": "LEC",
#         "associatedClassCode": 0,
#         "maxEnrollmentCapacity": 20,
#         "enrolledStudents": 18,
#         "enrollConsentCode": "D",
#         "enrollConsentDescription": "No Consent Required",
#         "dropConsentCode": "N",
#         "dropConsentDescription": "No Consent Required",
#         "scheduleData": [
#             {
#                 "courseId": "004413",
#                 "courseOfferNumber": 2,
#                 "sessionCode": "1",
#                 "classSection": 1,
#                 "termCode": "1231",
#                 "classMeetingNumber": 1,
#                 "scheduleStartDate": "2023-01-09T00:00:00",
#                 "scheduleEndDate": "2023-04-10T00:00:00",
#                 "classMeetingStartTime": "2023-03-06T14:30:00",
#                 "classMeetingEndTime": "2023-03-06T15:50:00",
#                 "classMeetingDayPatternCode": "TR",
#                 "classMeetingWeekPatternCode": "NYNYNNN",
#                 "locationName": "MC 4059",
#             }
#         ],
#         "instructorData": [
#             {
#                 "courseId": "004413",
#                 "courseOfferNumber": 2,
#                 "sessionCode": "1",
#                 "classSection": 1,
#                 "termCode": "1231",
#                 "instructorRoleCode": "PI",
#                 "instructorFirstName": "Victoria",
#                 "instructorLastName": "Sakhnini",
#                 "instructorUniqueIdentifier": "6E3E59FEAF580F0FF874DA3F515646C611FCFFF1E1E2F4DDC01ED7108D00076D",
#                 "classMeetingNumber": 1,
#             }
#         ],
#     },
#     {
#         "courseId": "004413",
#         "courseOfferNumber": 2,
#         "sessionCode": "1",
#         "classSection": 101,
#         "termCode": "1231",
#         "classNumber": 4823,
#         "courseComponent": "TUT",
#         "associatedClassCode": 0,
#         "maxEnrollmentCapacity": 20,
#         "enrolledStudents": 18,
#         "enrollConsentCode": "N",
#         "enrollConsentDescription": "No Consent Required",
#         "dropConsentCode": "N",
#         "dropConsentDescription": "No Consent Required",
#         "scheduleData": [
#             {
#                 "courseId": "004413",
#                 "courseOfferNumber": 2,
#                 "sessionCode": "1",
#                 "classSection": 101,
#                 "termCode": "1231",
#                 "classMeetingNumber": 1,
#                 "scheduleStartDate": "2023-01-09T00:00:00",
#                 "scheduleEndDate": "2023-04-10T00:00:00",
#                 "classMeetingStartTime": "2023-03-06T16:00:00",
#                 "classMeetingEndTime": "2023-03-06T17:20:00",
#                 "classMeetingDayPatternCode": "M",
#                 "classMeetingWeekPatternCode": "YNNNNNN",
#                 "locationName": "MC 4045",
#             }
#         ],
#         "instructorData": [
#             {
#                 "courseId": "004413",
#                 "courseOfferNumber": 2,
#                 "sessionCode": "1",
#                 "classSection": 101,
#                 "termCode": "1231",
#                 "instructorRoleCode": "PI",
#                 "instructorFirstName": "Victoria",
#                 "instructorLastName": "Sakhnini",
#                 "instructorUniqueIdentifier": "6E3E59FEAF580F0FF874DA3F515646C611FCFFF1E1E2F4DDC01ED7108D00076D",
#                 "classMeetingNumber": 1,
#             }
#         ],
#     },
# ]


def _get_current_term():
    return _make_request("Terms/current")


def clear_database():
    print("Clearing database...")
    Course.objects().delete()
    print("Database cleared 🗑")


# Helper function to remove all the sections from courses
def _clear_sections():
    for c in Course.objects.order_by("-sections"):
        if c.sections:
            print(c.name)
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


def update_database():
    res = update_six_terms_data()
    print(res)
    update_current_term_data()


if __name__ == "__main__":
    app = create_app("development")
    if "clear" in sys.argv:
        clear_database()
    else:
        update_database()
