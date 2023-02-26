import json
import requests
from enum import Enum


class Season(Enum):
    __order__ = "FALL WINTER SPRING"
    FALL = "F"
    WINTER = "W"
    SPRING = "S"


def next_season(current, year):
    if current == Season.WINTER.value:
        current = Season.WINTER
        result = Season.SPRING
        year -= 2
    elif current == Season.SPRING.value:
        current = Season.SPRING
        result = Season.FALL
        year -= 1
    elif current == Season.FALL.value:
        current = Season.FALL
        result = Season.WINTER
        year -= 2
    else:
        print(f"invalid season {current}")
        result = ""

    return current, result, year


header = {'x-api-key': 'A283CC14D0F349789C04A02889D7B5F4', 'accept': 'application/json'}
api_path = 'https://openapi.data.uwaterloo.ca/v3/'


# Term Opendata API requests
def get_current_term():
    response = requests.get(api_path + 'Terms/current', headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_all_terms():
    response = requests.get(api_path + 'Terms', headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_last_six_terms():
    current_term = get_current_term()['nameShort']
    current_year = int(current_term[0:4])
    current_season = current_term[-1].upper()

    current_season, new_season, new_year = next_season(current_season, current_year)
    wanted_terms = {}

    for i in range(6):
        wanted_terms[f"{new_year} {new_season.value}"] = i

        if new_season == Season.SPRING:
            new_year += 1

        _, new_season, _ = next_season(new_season.value, 0)

    all_terms = get_all_terms()

    result = {}

    for term in all_terms:
        if term['nameShort'] in wanted_terms.keys():
            result[term['termCode']] = term

    return result


def get_term_by_code(code):
    response = requests.get(f"{api_path}Terms/{code}", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_term_by_year(year):
    response = requests.get(f"{api_path}Terms/foracademicyear/{year}", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


# Course Opendata API requests
def get_courses_by_term(code):
    # This takes a very long time to run that it hangs
    response = requests.get(f"{api_path}Courses/{code}", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_courses_by_term_and_course(code, course_id):
    response = requests.get(f"{api_path}Courses/{code}/{course_id}", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_courses_by_term_and_subject(code, subject):
    response = requests.get(f"{api_path}Courses/{code}/{subject}", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_last_six_term_all_courses():
    # this hangs because of the AllCourse OpenData call
    last_six_terms = get_last_six_terms()
    last_six_term_courses = {}

    for code in last_six_terms.keys():
        last_six_term_courses[code] = get_courses_by_term(code)

    return last_six_term_courses


def get_last_six_term_course_details_from_class_schedule():
    # this gets course details with the class schedule endpoint course id results
    last_six_term_class_schedule_course_id = get_last_six_term_class_schedule_course_id()
    last_six_term_course_details = {}

    for code in last_six_term_class_schedule_course_id.keys():
        for course_id in last_six_term_class_schedule_course_id[code]:
            last_six_term_course_details[code][course_id] = get_courses_by_term_and_course(code, course_id)

    return last_six_term_course_details


# Class Schedule Opendata API requests
def get_class_schedule_by_term(code):
    response = requests.get(f"{api_path}ClassSchedules/{code}", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_class_schedule_by_term_and_course(code, course_id):
    response = requests.get(f"{api_path}ClassSchedules/{code}/{course_id}", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_last_six_term_class_schedule_course_id():
    last_six_terms = get_last_six_terms()
    last_six_term_class_schedule_course_id = {}

    for code in last_six_terms.keys():
        last_six_term_class_schedule_course_id[code] = get_class_schedule_by_term(code)

    return last_six_term_class_schedule_course_id


def get_last_six_term_class_schedule_details():
    last_six_term_class_schedule_course_id = get_last_six_term_class_schedule_course_id()
    last_six_term_class_schedule_details = {}

    for code in last_six_term_class_schedule_course_id.keys():
        for course_id in last_six_term_class_schedule_course_id[code]:
            last_six_term_class_schedule_details[code][course_id] = get_class_schedule_by_term_and_course(code,
                                                                                                          course_id)

    return last_six_term_class_schedule_details


# Important Dates Opendata API requests
def get_important_dates():
    response = requests.get(f"{api_path}ImportantDates", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


# Location Opendata API requests
def get_locations():
    response = requests.get(f"{api_path}Locations", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


# Subject Opendata API requests
def get_all_subjects():
    response = requests.get(f"{api_path}Subjects", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_subject_by_code(code):
    response = requests.get(f"{api_path}Subjects/{code}", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


# Exam Schedule Opendata API requests
def get_exam_schedule_by_term(code):
    # this looks to be broken on the side of the university -- not reliable
    response = requests.get(f"{api_path}ExamSchedules/{code}", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def get_current_exam_schedule():
    response = requests.get(f"{api_path}ExamSchedules", headers=header)
    if response.status_code == 200:
        print("sucessfully fetched the data")
        formatted_print(response.json())
        return response.json()
    else:
        print(
            f"{response.status_code} error with your request")


def formatted_print(obj):
    text = json.dumps(obj, sort_keys=True, indent=4)
    print(text)


# testing
get_important_dates()
