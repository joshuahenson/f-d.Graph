import json
import os
from selenium import webdriver
from time import sleep

RECORDS = 50

driver = webdriver.Firefox()
driver.get("https://medium.freecodecamp.com/latest")
assert "Free Code Camp" in driver.title

for i in range(RECORDS / 10 - 1):
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    sleep(3) #allow everything to load

avatars = driver.find_elements_by_css_selector(".avatar>img")
fcc_avatar = avatars.pop()
authors = driver.find_elements_by_css_selector(".postMetaInline-feedSummary>a")
article_titles = driver.find_elements_by_css_selector(".section-inner h3:first-of-type, .section-inner h2:first-of-type")
article_links = driver.find_elements_by_css_selector(".postArticle > a")

assert len(avatars) == len(authors) == len(article_titles) == len(article_links)

articles = [];

for i in range(len(avatars)):
    articles.append({'avatar': avatars[i].get_attribute("src"), 'author': authors[i].text, 'title': article_titles[i].text, 'url': article_links[i].get_attribute("href")})

data = {'pubAvatar': fcc_avatar.get_attribute("src"), 'articles': articles}

path = os.path.dirname(os.path.abspath(__file__))
with open(path + '/data.json', 'w') as output:
    json.dump(data, output)

driver.close()
