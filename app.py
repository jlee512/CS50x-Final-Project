from flask import Flask, render_template, flash, redirect, request, Response, session, url_for, jsonify
from flask_session import Session
import json
from flask_jsglue import JSGlue
import os
import redis
from redissession import *
from mysql_db import MySQL_Database
from passlib.hash import bcrypt
from datetime import datetime

from helpers import *

# Configure application
app = Flask(__name__)
jsglue = JSGlue(app)

# Configure application secret key and database depending on local/production instance
if os.environ['ENV_TYPE'] == 'LOCAL':
    import configparser

    dir = os.path.dirname(__file__)
    filename = os.path.join(dir, 'config.ini')
    config = configparser.ConfigParser()
    config.read(filename)

    local = config['LOCAL']
    app.secret_key = local['SECRET_KEY']

    redis_instance = redis.Redis(host=local["REDIS_HOST"], port=local["REDIS_PORT"], password=local["REDIS_PASSWORD"])

else:
    # Configure app secret key
    app.secret_key = os.environ['SECRET_KEY']

    # Configure app redis instance for session storage
    import urllib

    url = urllib.parse.urlparse(os.environ.get('REDISCLOUD_URL'))
    redis_instance = redis.Redis(host=url.hostname, port=url.port, password=url.password)

# configure session to use Redis (instead of signed cookies or local storage. Local storage was causing issues amongst multiple workers used for gunicorn server)
app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_REDIS"] = redis_instance
app.session_interface = RedisSessionInterface(redis=redis_instance, prefix="session:")


@app.route('/')
@login_required
def index():
    rank = session["rank"]
    return render_template('index.html')


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in."""

    # forget any user_id
    session.clear()

    # Check details
    username_entry = request.form.get("username")
    password_entry = request.form.get("password")

    # if user reached route via POST (i.e. login form submission)
    if request.method == "POST":
        # ensure username was submitted
        if not request.form.get("username"):
            print("username empty")
            return render_template("login.html", err_message="Please provide a username")

        # ensure password was submitted
        elif not request.form.get("password"):
            print("password empty")
            return render_template("login.html", err_message="Please provide your password")

        # query database for username
        db = MySQL_Database()
        rows = db.query('SELECT * FROM registered_users WHERE username=%s', [username_entry])
        db.check_connection()

        # ensure username exists and password is correct
        if len(rows) != 1 or not bcrypt.verify(password_entry, rows[0]["hash"]):
            print("Username or password was incorrect")
            return render_template("login.html", err_message="Your username or password was incorrect")

        session["user_id"] = rows[0]['user_id']
        session["rank"] = rows[0]['rank']

        return redirect(url_for("index"))
    else:
        return render_template("login.html")


@app.route('/logout')
def logout():
    """Log user out"""

    # forget any user_id
    session.clear()

    # redirect user to login form
    return redirect(url_for("login"))


@app.route('/register', methods=["GET", "POST"])
def register():
    """Register user"""

    if request.method == "POST":
        # If no username is required re-render template with error message
        if not request.form.get("username"):
            print("No username input")
            return render_template("register.html", err_message="Please choose a username")
        elif len(request.form.get("username")) < 6:
            print("Username too short")
            return render_template("register.html", err_message="Username must be a minimum of 6 characters long")
        elif not request.form.get("email"):
            print("No email input")
            return render_template("register.html", err_message="Please enter your email")
        elif not request.form.get("password"):
            print("No password input")
            return render_template("register.html", err_message="Please choose a password")

        username_entry = request.form.get("username")
        email_entry = request.form.get("email")
        password_entry = request.form.get("password")

        # Check if username is already taken in the database
        db = MySQL_Database()
        # rows = db.query('SELECT * FROM registered_users WHERE username=%s', [username_entry])

        # if len(rows) > 0:
        #     print("Username already exists")
        #     return render_template("register.html", err_message="The username you have chosen already exists")

        hash = bcrypt.using(rounds=13).hash(password_entry)
        hash_bin = bytes(hash, 'utf-8')

        result = db.insert('INSERT INTO registered_users (username, hash, email, rank) VALUES (%s, %s, %s, %s)',
                           [username_entry, hash_bin, email_entry, 1])
        db.check_connection()

        if not result:
            print("Chosen username is already taken")
            return render_template("register.html", err_message="Your chosen username is already taken")

        # query database for username
        db = MySQL_Database()
        rows = db.query('SELECT * FROM registered_users WHERE username=%s', [username_entry])
        db.check_connection()

        # ensure username exists and password is correct
        if len(rows) != 1 or not bcrypt.verify(password_entry, rows[0]["hash"]):
            print("Username or password was incorrect")
            return render_template("login.html", err_message="Your username or password was incorrect")

        session["user_id"] = rows[0]['user_id']
        session["rank"] = rows[0]['rank']

        return redirect(url_for("index"))

    else:
        return render_template("register.html")


@app.route('/my_trips')
@login_required
def my_trips():
    if request.method == "GET":
        # query database for user trips
        db = MySQL_Database()
        trips = db.query(
            'SELECT t.trip_id, t.date_started, t.date_completed, w.walk_name, w.walk_id FROM completed_trips AS t, walks_set AS w WHERE t.walk_id = w.walk_id AND user_id=%s ORDER BY t.date_completed',
            [session["user_id"]])
        db.check_connection()

        for trip in trips:
            trip['date_started'] = '{:%d/%m/%Y}'.format(trip['date_started'])
            trip['date_completed'] = '{:%d/%m/%Y}'.format(trip['date_completed'])

        return render_template("trips_management.html", trips=trips)
    else:
        return redirect(url_for("index"))


@app.route('/add_walk', methods=['GET', 'POST'])
@login_required
def add_walk():
    if request.method == "POST":
        # Process new walk post. Calculate date and push to database
        selected_walk = request.form.get("walks-set")
        start_day = request.form.get("day")
        start_month = request.form.get("month")
        start_year = request.form.get("year")
        start_date_string = start_day + " " + start_month + " " + start_year
        duration = request.form.get("duration")

        # Convert start date and end date into datetime objects
        start_date = datetime.strptime(start_date_string, '%d %B %Y')
        start_date_formatted = start_date.strftime('%Y-%m-%d %H:%M:%S')
        finish_date = start_date + timedelta(days=int(duration))
        finish_date_formatted = finish_date.strftime('%Y-%m-%d %H:%M:%S')

        # Push results to the database
        db = MySQL_Database()
        result = db.insert(
            'INSERT INTO completed_trips (user_id, walk_id, date_started, date_completed) VALUES (%s, (SELECT walk_id FROM walks_set WHERE walk_name=%s), %s, %s)',
            [session["user_id"], selected_walk, start_date_formatted, finish_date_formatted])

        db = MySQL_Database()

        # Logic required to update badges as a result (if a new walk is completed)
        result2 = db.insert(
            'INSERT INTO user_badges (badge_id, user_id, trip_id, award_date) VALUES ((SELECT badge_id FROM walks_set WHERE walk_name=%s), %s, (SELECT t.trip_id FROM completed_trips AS t, walks_set AS w WHERE t.user_id=%s AND w.walk_name=%s AND t.walk_id = w.walk_id), %s)',
            [selected_walk, session["user_id"], session["user_id"], selected_walk, finish_date_formatted]);

        db.check_connection()

        if not result:
            print("Walk could not be added")

        # If no badges are added, do not increment rank, otherwise, increment rank
        if not result2:
            print("No badges were added")
        else:
            # Update the session rank and database rank for given user
            session["rank"] = session["rank"] + 1
            user_id = session["user_id"]
            db = MySQL_Database()
            print(session["user_id"])
            print(session["rank"])
            result3 = rank_update(user_id)
            print("Trip successfully deleted and rank updated")
            if not result3:
                print("Rank could not be updated")

        return redirect(url_for("my_trips"))

    else:
        # Redirect to my_trips
        return redirect(url_for("index"))


@app.route('/walk/<walk_name>', methods=["GET"])
def walk_info(walk_name):
    db = MySQL_Database()

    walks = db.query('SELECT * FROM walks_set WHERE walk_name = %s', [walk_name])

    walk = walks[0]

    print(walk)

    walk['great_walks_season_start'] = '{:%d/%m/%Y}'.format(walk['great_walks_season_start'])
    walk['great_walks_season_end'] = '{:%d/%m/%Y}'.format(walk['great_walks_season_end'])

    return render_template("walk_info_page.html", walk=walk)


@app.route('/delete_walk/<trip_id>', methods=["GET"])
def delete_walk(trip_id):
    db = MySQL_Database()

    deletion = db.update('DELETE FROM completed_trips WHERE trip_id = %s;', [trip_id])

    if deletion:
        user_id = session["user_id"]
        result3 = rank_update(user_id)
        if not result3:
            print("Rank could not be updated")
        else:
            print("Trip successfully deleted and rank updated")

    return redirect(url_for("my_trips"))


# Under construction page
@app.route('/underconstruction')
def under_construction():
    return render_template("under_construction.html")


# JSON/Form validation application routes

@app.route('/username_check', methods=['POST'])
def username_check():
    username_input_check = request.json['username']

    db = MySQL_Database()

    rows = db.query('SELECT * FROM registered_users WHERE username = %s', [username_input_check])
    db.check_connection()

    print(rows)

    if len(rows) > 0:
        return "invalid"

    return "valid"


@app.route('/basic_walks_query', methods=['GET'])
def basic_walks_query():
    # Access URL 'GET' parameters
    from_url_param = request.args.get('from', type=int)
    count_url_param = request.args.get('count', type=int)
    sort_by_url_param = request.args.get('sort_by')
    ordering_url_param = request.args.get('ordering')
    search_term_url_param = request.args.get('search_term')

    # Access database and pull the corresponding records and process into a JSON array
    db = MySQL_Database()

    json_walks = db.query('SELECT * FROM walks_set LIMIT %s OFFSET %s;', [count_url_param, from_url_param])

    for walk in json_walks:
        walk['one_way_distance'] = float(walk['one_way_distance'])
        walk['great_walks_season_start'] = '{:%d/%m/%Y}'.format(walk['great_walks_season_start'])
        walk['great_walks_season_end'] = '{:%d/%m/%Y}'.format(walk['great_walks_season_end'])

    return Response(json.dumps(json_walks), mimetype="application/json")


@app.route('/user_badges_query', methods=['GET'])
def user_badges_query():
    # Access user information for query
    user_id = session["user_id"]

    # Access database and pull the corresponding records and process into a JSON array
    db = MySQL_Database()

    json_user_badges = db.query(
        'SELECT b.badge_id, b.user_id, b.trip_id, b.award_date, w.walk_id, w.one_way_distance FROM user_badges AS b, completed_trips AS t, walks_set AS w WHERE b.trip_id = t.trip_id AND t.walk_id = w.walk_id AND b.user_id = %s ORDER BY w.walk_id;',
        [user_id])

    for badge in json_user_badges:
        badge['award_date'] = '{:%d/%m/%Y}'.format(badge['award_date'])

    return Response(json.dumps(json_user_badges), mimetype="application/json")


@app.route('/total_distance_query', methods=['GET'])
def total_distance_query():
    # Access user information for query
    user_id = session["user_id"]

    # Access database and pull sum of all walk one-way-distances for the specific user_id
    db = MySQL_Database()

    #  Query to extract a user's total travel distance
    json_user_total_distance = db.query(
        'SELECT SUM(w.one_way_distance) AS total_distance FROM completed_trips AS t, walks_set AS w WHERE t.walk_id=w.walk_id AND t.user_id=%s',
        [user_id])

    if json_user_total_distance[0]['total_distance'] is None:
        json_user_total_distance[0]['total_distance'] = 0

    print(json_user_total_distance)

    return Response(json.dumps(json_user_total_distance), mimetype="application/json")


@app.route('/get_rank', methods=['GET'])
def get_rank():
    db = MySQL_Database()

    rank_query = db.query('SELECT rank FROM registered_users WHERE user_id=%s', [session["user_id"]])

    if not rank_query:
        print("Rank could not be accessed from the database")
        rank = {'rank': -1}
    else:
        rank = rank_query[0]
        session["rank"] = rank["rank"]
        print(session["rank"])

    return Response(json.dumps(rank), mimetype="application/json")


@app.route('/test')
def test():
    print("test app route")

    db = MySQL_Database()

    rows = db.query('SELECT * FROM testtable', [])

    test = os.environ['ENV_TYPE']

    if len(rows) == 0:
        return "Sorry no results"

    return render_template("test.html", rows=rows, test=test)


@app.route('/setupDB')
def setupDB():
    print("Re-initializing DB...")
    # TODO


if __name__ == '__main__':
    app.run()
