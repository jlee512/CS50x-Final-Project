from flask import Flask, render_template
import os

from mysql_db import MySQL_Database

app = Flask(__name__)


@app.route('/')
def index():

    return render_template('index.html')


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
