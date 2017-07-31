import flask
from flask import Flask, render_template, flash, redirect, request, session, url_for
from flask_session import Session

from passlib.hash import sha256_crypt

import os

from mysql_db import MySQL_Database

app = Flask(__name__)



@app.route('/')
def index():
    # if request.method
    return render_template('index.html')

@app.route('/home')
def welcome():
    return render_template('welcome.html')

@app.route('/login')
def login():
    return render_template('under_construction.html')

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
