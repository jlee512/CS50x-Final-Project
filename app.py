from flask import Flask, render_template, flash, redirect, request, session, url_for
from flask_session import Session
from flask_jsglue import JSGlue
import os
import redis
from redissession import *
from mysql_db import MySQL_Database
from passlib.hash import bcrypt

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

        result = db.insert('INSERT INTO registered_users (username, hash, email) VALUES (%s, %s, %s)', [username_entry, hash_bin,email_entry])
        db.check_connection()

        if not result:
            print("Chosen username is already taken")
            return render_template("register.html", err_message="Your chosen username is already taken")

        return render_template("index.html")

    else:
        return render_template("register.html")

@app.route('/underconstruction')
def under_construction():
    return render_template("under_construction.html")

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


@app.route('/test')
def test():

    print("test app route")

    db = MySQL_Database()

    rows = db.query('SELECT * FROM testtable', [])

    test = os.environ['ENV_TYPE']

    if len(rows) == 0:
        return "Sorry no results"

    return render_template("test.html", rows=rows, test=test)


if __name__ == '__main__':
    app.run()
