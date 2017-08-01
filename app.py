import flask
from flask import Flask, render_template, flash, redirect, request, session, url_for
from flask_session import Session

from passlib.hash import sha256_crypt

from helpers import *

import os

from mysql_db import MySQL_Database

app = Flask(__name__)


@app.route('/')
@login_required
def index():
    return render_template('index.html')


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/logout')
def logout():
    return render_template('under_construction.html')


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
