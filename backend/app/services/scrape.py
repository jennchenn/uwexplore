from selenium import webdriver
from BeautifulSoup import BeautifulSoup
import pandas as pd

driver = webdriver.Chrome("/usr/lib/chromium-browser/chromedriver")

easyRating = ""  # Easy percentage rating
usefulRating = ""  # Useful percentage rating
likedRating = ""  # Liked percentage rating
commentsCount = 0  # Number of comments
comments = []  # List of class ratings
ratingsCount = 0  # Number of ratings
course = "cs115"
driver.get("https://uwflow.com/course/" + course)

content = driver.page_source
soup = BeautifulSoup(content)

for ratingWrapper in soup.findAll('div', attrs={'class': 'sc-qXhiz cejBIe'}):
    easyRating = ratingWrapper.find('div', attrs={'class': 'sc-pcJja jjDvpo'}).text
    usefulRating = ratingWrapper.find('div', attrs={'class': 'sc-pcJja jjDvpo'}).text
    likedRating = ratingWrapper.find('div', attrs={'class': 'sc-psQdR iYtUny'}).text
    commentsCount = int(ratingWrapper.find('a', attrs={'class': 'sc-qPwPv gjSZrg'}).text[0])
    ratingsCount = int(ratingWrapper.find('div', attrs={'class': 'sc-qXRQq hXXFXN'}).text[0])

if commentsCount > 0:
    for commentCard in soup.findAll('div', attrs={'class': 'sc-pcZJD cnFfnA'}):
        item = {}
        item.comment = commentCard.find('div', attrs={'class': 'sc-pLwIe kqSAIH'}).text
        item.program = commentCard.find('div', attrs={'class': 'sc-pTWqp kvWxGq'}).text[0]
        item.prof = commentCard.find('a', attrs={'class': 'sc-qWQHW jhagES'}).text
        comments.append(item)
