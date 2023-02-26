from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import re


def get_course_reviews(course):
    url = "https://uwflow.com/course/" + course

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument("start-maximized")
    options.add_argument("disable-infobars")
    options.add_argument("--disable-extensions")
    options.add_argument("--incognito")

    driver = webdriver.Chrome("chromedriver", options=options)
    driver.get(url)
    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".sc-qXRQq.hXXFXN")))

    content = driver.page_source
    soup = BeautifulSoup(content, 'html.parser')

    rating = soup.find_all('div', attrs={'class': 'sc-pcJja jjDvpo'})
    easy_rating = rating[0].text if rating[0].text[-1] == "%" else ""
    useful_rating = rating[1].text if rating[1].text[-1] == "%" else ""
    liked_rating = soup.find('div', attrs={'class': 'sc-psQdR iYtUny'}).text if \
        soup.find('div', attrs={'class': 'sc-psQdR iYtUny'}).text[-1] == "%" else ""
    comments_count = int(re.findall(r'\d+', soup.find('a', attrs={'class': 'sc-qPwPv gjSZrg'}).text)[0])
    ratings_count = int(re.findall(r'\d+', soup.find('div', attrs={'class': 'sc-qXRQq hXXFXN'}).text)[0])
    comments = []

    if comments_count > 0:
        # get top comments on the page
        for commentCard in soup.findAll('div', attrs={'class': 'sc-pcZJD cnFfnA'}):
            item = {
                'comment': commentCard.find('div', attrs={'class': 'sc-pLwIe kqSAIH'}).text if commentCard.find('div',
                                                                                                                attrs={
                                                                                                                    'class': 'sc-pLwIe kqSAIH'}) else "",
                'author': commentCard.find('div', attrs={'class': 'sc-pTWqp kvWxGq'}).text if commentCard.find('div',
                                                                                                               attrs={
                                                                                                                   'class': 'sc-pTWqp kvWxGq'}) else ""}
            comments.append(item)

    driver.quit()
    return easy_rating, useful_rating, liked_rating, comments_count, ratings_count, comments


def get_course_term_offered(course):
    url = "https://uwflow.com/course/" + course

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument("start-maximized")
    options.add_argument("disable-infobars")
    options.add_argument("--disable-extensions")
    options.add_argument("--incognito")

    driver = webdriver.Chrome("chromedriver", options=options)
    driver.get(url)
    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".sc-pAyMl.dPzwlT")))

    content = driver.page_source
    soup = BeautifulSoup(content, 'html.parser')

    summary = soup.find('div', attrs={'class': 'sc-pAyMl dPzwlT'}).text
    terms = summary.split("Offered: ", 1)[1][:-1]

    driver.quit()
    return terms


# # testing code
# value = "cs115"
# get_course_reviews(value)
# get_course_term_offered(value)
