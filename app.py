from flask import Flask, render_template, flash, redirect, request, session, url_for
from flask_session import Session
import os
import redis
from redissession import *
from mysql_db import MySQL_Database
from passlib.hash import bcrypt

from helpers import *

# Configure application
app = Flask(__name__)

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
db = MySQL_Database()

@app.route('/')
@login_required
def index():
    return render_template('index.html')


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in."""

    # forget any user_id
    session.clear()

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
        rows = db.query('SELECT * FROM registered_users WHERE username=%s', ["username"])

        # ensure username exists and password is correct
        if len(rows) != 1 or not bcrypt.verify(request.form.get("password"), rows[0]["hash"]):
            return render_template("login.html", err_message="This username does not exist")

        session["user_id"] = rows[0]['user_id']

        print(session.get("user_id"))

        return redirect(url_for("index"))
    else:
        return render_template("login.html")


@app.route('/logout')
def logout():
    """Log user out."""

    # forget any user_id
    session.clear()

    # redirect user to login form
    return redirect(url_for("login"))

@app.route('/register')
def register():

    return render_template("register.html")

@app.route('/underconstruction')
def under_construction():
    return render_template("under_construction.html")


@app.route('/test')
def test():

    rows = db.query('SELECT * FROM testtable', [])

    test = os.environ['ENV_TYPE']

    if len(rows) == 0:
        return "Sorry no results"

    return render_template("test.html", rows=rows, test=test)


if __name__ == '__main__':
    app.run()
