from flask import Flask, render_template, flash, redirect, request, session, url_for
from flask_session import Session
from tempfile import mkdtemp
import os
from mysql_db import MySQL_Database
from passlib.hash import sha256_crypt

from helpers import *

# Configure application
app = Flask(__name__)

if os.environ['ENV_TYPE'] == 'LOCAL':
    import configparser

    dir = os.path.dirname(__file__)
    filename = os.path.join(dir, 'config.ini')
    config = configparser.ConfigParser()
    config.read(filename)

    local = config['LOCAL']
    app.secret_key = local['SECRET_KEY']
else:
    app.secret_key = os.environ['SECRET_KEY']

# configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

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

        print(request.form.get("username"))
        print(request.form.get("password"))

        session["user_id"] = 1

        print(session.get("user_id"))

        return redirect(url_for("index"))
    #     # query database for username
    #     rows = db.execute("SELECT * FROM users WHERE username = :username", username=request.form.get("username"))
    #
    #     # ensure username exists and password is correct
    #     if len(rows) != 1 or not pwd_context.verify(request.form.get("password"), rows[0]["hash"]):
    #         return apology("invalid username and/or password")
    #
    #     # remember which user has logged in
    #     session["user_id"] = rows[0]["id"]
    #
    #     # redirect user to home page
    #     return redirect(url_for("index"))
    #
    # # else if user reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route('/logout')
def logout():
    """Log user out."""

    # forget any user_id
    session.clear()

    # redirect user to login form
    return redirect(url_for("login"))

@app.route('/underconstruction')
def under_construction():
    return render_template("under_construction.html")

@app.route('/test')
def test():
    db = MySQL_Database()

    rows = db.query('SELECT * FROM testtable', [])

    test = os.environ['ENV_TYPE']

    if len(rows) == 0:
        return "Sorry no results"

    return render_template("test.html", rows=rows, test=test)

if __name__ == '__main__':
    app.run()
