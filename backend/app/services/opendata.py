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


def formatted_print(obj):
    text = json.dumps(obj, sort_keys=True, indent=4)
    print(text)


get_last_six_terms()
