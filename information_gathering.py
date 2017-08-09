from mysql_db import MySQL_Database
import requests
from urllib.request import urlopen
import lxml
from bs4 import BeautifulSoup
import re
import os


def number_span(tag):
    return tag.name == 'strong' and 'Great Walks season' in tag.text


class Walk:
    _id = None
    _name = None
    _classname = None
    _background_image_link = None
    _region = None
    _country = None
    _one_way_distance = None
    _loop = None
    _doc_site_hyperlink = None
    _nz_scale_latitude = None
    _nz_scale_longitude = None

    # Array variables to be stored within their own database tables
    _highlights = []
    _travel_options = []
    _travel_option_time = []
    _seasonal_restrictions = []

    # Constructor
    def __init__(self, name, region, country, highlights, one_way_distance, loop, doc_site_hyperlink,
                 great_walks_season_start, great_walks_season_end, travel_options, travel_time, seasonal_restrictions):
        self._name = name
        self._classname = name[:10] + "-walk"
        self._background_image_link = "/static/Media/Photographs/Walks/" + name.replace(" ", "").replace("+",
                                                                                                         "").lower() + ".jpg"
        self._region = region
        self._country = country
        self._one_way_distance = one_way_distance
        self._loop = loop
        self._doc_site_hyperlink = doc_site_hyperlink
        self._great_walks_seasion_start = great_walks_season_start
        self._great_walks_seasion_end = great_walks_season_end

        # Array variables
        self._highlights = highlights
        self._travel_options = travel_options
        self._travel_option_time = travel_time
        self._seasonal_restrictions = seasonal_restrictions

    # Set the instance id based on the database autoincrement id
    def set_id(self, id):
        # Query database for autoincrement id
        db = MySQL_Database()

        db.query("SELECT * FROM walks_set WHERE walk_name = %s", [self._name])

    # Set location based on manual lookup of
    def set_location(self, nz_scale_latitude, nz_scale_longitude):
        self._nz_scale_latitude = nz_scale_latitude
        self._nz_scale_longitude = nz_scale_longitude

    def push_to_database(self):
        db = MySQL_Database()

        db.insert(
            "INSERT INTO walks_set(walk_name, class_name, background_image, walk_region, walk_country, one_way_distance, loop_track, doc_site_hyperlink, nz_scale_latitude, nz_scale_longitude, great_walks_season_start, great_walks_season_end) VALUES %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s;",
            [self._name, self._classname, self._background_image_link, self._region, self._country,
             self._one_way_distance, self._loop, self._doc_site_hyperlink, self._nz_scale_latitude,
             self._nz_scale_longitude, self._great_walks_seasion_start, self._great_walks_seasion_end])


# def parse_walk_information():


# url = "http://www.doc.govt.nz"
# great_walks_page_subdomain = "/great-walks"
#
# # Query the home webpage to extract all great walks
# great_walks_page = urlopen(url + great_walks_page_subdomain)
#
# # Parse the HTML using beautiful soup and store in variable 'great_walks_page_soup"
# great_walks_page_soup = BeautifulSoup(great_walks_page, 'html.parser')
#
# f = open(os.path.join("Web_Information_Gathering", "doc_main.html"), 'w')
# f.write(str(great_walks_page_soup.encode("UTF-8")))
# f.close()

def main():
    # parse_walk_information()
    # Web information written to file to reduce loading of DOC website
    great_walks_page_soup = BeautifulSoup(open(os.path.join("Web_Information_Gathering", "doc_main.html")),
                                          'html.parser')
    # print(great_walks_page_soup.prettify())

    walk_cards = great_walks_page_soup.findAll('div', attrs={'class': ['product-panel', 'small']})

    for walk_card in walk_cards:
        # 1) Get walk_name
        walk_name = walk_card.find('h3').text.replace('and', '+')
        print("Processing: " + walk_name)

        # 2) Get walk region
        walk_region = walk_card.find('span', attrs={'class': 'product-region'}).text

        # 3) Get walk country (currently New Zealand) and hyperlink
        walk_country = "New Zealand"
        doc_site_hyperlink = "http://www.doc.govt.nz" + walk_card.find('a')['href']

        # Access the specific walk page for further information
        # specific_walk_page = urlopen(doc_site_hyperlink)

        specific_walk_page_soup = BeautifulSoup(
            open(os.path.join("Web_Information_Gathering", walk_name + "_doc.html")),
            'html.parser')

        # f = open(os.path.join("Web_Information_Gathering", walk_name + "_doc.html"), 'w')
        # f.write(str(specific_walk_page_soup.encode("UTF-8")))
        # f.close()

        track_distance_string = specific_walk_page_soup.find('span', attrs={'class', 'track-distance'}).find('p').text

        # 4) Assign loop_walk boolean
        if "loop" not in track_distance_string:
            loop_walk = False
        else:
            loop_walk = True

        # 5) Store walk distance in kilometers
        track_distance = re.match("([0-9]+.[0-9])+|[0-9]+", track_distance_string).group()

        print("Track distance: " + track_distance)

        # 6) Obtain and store the highlights of the walk (for use in a later database table
        specific_walk_highlights = specific_walk_page_soup.find('h2', string="Highlights").find_next_sibling().findAll(
            'li')

        walk_highlights = []
        for highlight in specific_walk_highlights:
            walk_highlights.append(highlight.text)

        # 7) Add travel options and durations for the walk

        walk_travel_option = []
        walk_travel_option_time = []
        if specific_walk_page_soup.find('div', attrs={'class', 'details-walk'}):
            walk_travel_option.append("Walking and Tramping")
            walk_travel_option_time.append(specific_walk_page_soup.find('div', attrs={'class', 'details-walk'}).find('',
                                                                                                                     attrs={
                                                                                                                     'class',
                                                                                                                     'details-walk-time'}).text.replace(
                " - ", " to ").replace("-", " to ").replace(" one way", ""))
        if specific_walk_page_soup.find('div', attrs={'class', 'details-paddling'}):
            walk_travel_option.append("Kayaking and Canoeing")
            walk_travel_option_time.append(
                specific_walk_page_soup.find('div', attrs={'class', 'details-paddling'}).find('', attrs={'class',
                                                                                                         'details-paddling-time'}).text.replace(
                    " - ", " to ").replace("-", " to ").replace(" one way", ""))
        if specific_walk_page_soup.find('div', attrs={'class', 'details-mtb'}):
            walk_travel_option.append("Mountain Biking")
            walk_travel_option_time.append(specific_walk_page_soup.find('div', attrs={'class', 'details-mtb'}).find('',
                                                                                                                    attrs={
                                                                                                                    'class',
                                                                                                                    'details-mtb-time'}).text.replace(
                " - ", " to ").replace("-", " to ").replace(" one way", ""))

        if specific_walk_page_soup.find('div', attrs={'class', 'details-seasonal'}):
            if specific_walk_page_soup.find('div', attrs={'class', 'details-seasonal'}).find(number_span) is not None:
                dates = re.findall("[0-9]+ +.[a-z]+ +[0-9]+",
                                   specific_walk_page_soup.find('div', attrs={'class', 'details-seasonal'}).find(
                                       number_span).text)
                great_walks_season_start_date = dates[0]
                great_walks_season_end_date = dates[1]
                print(great_walks_season_start_date)
                print(great_walks_season_end_date)


if __name__ == "__main__":
    main()
