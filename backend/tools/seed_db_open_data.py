import datetime
import os
import sys
from enum import Enum

import requests

from app import create_app
from app.models.course import ClassType, Course, CourseType, Section, Weekday

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


def _get_six_terms_data():
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


def get_courses():
    terms = _get_six_terms_data()
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


def insert_courses(courses):
    exceptions = []
    for course in courses:
        try:
            Course(
                name=course["title"],
                department=course["subjectCode"],
                code=course["catalogNumber"],
                course_id=course["courseId"],
                description=course["description"],
                description_abbreviated=course["descriptionAbbreviated"],
            ).save()
        except Exception as e:
            exceptions.append(f"{course['title']} {course['subjectCode']}: {e}")
    return exceptions


def clear_database():
    print("Clearing database...")
    Course.objects().delete()
    print("Database cleared 🗑")


def update_database():
    courses = get_courses()
    print(insert_courses(courses[:10]))


if __name__ == "__main__":
    app = create_app("development")
    if "clear" in sys.argv:
        clear_database()
    else:
        update_database()
