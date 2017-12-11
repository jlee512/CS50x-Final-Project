from flask import redirect, render_template, request, session, url_for
from functools import wraps
from mysql_db import MySQL_Database


def login_required(f):
    """
    Decorate routes which require login
    :param f: 
    :return f(*args, **kwargs) OR redirection to login page: 
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        print(session.get("user_id"))
        if "user_id" not in session:
            print("failed because of login_required")
            return redirect(url_for("login", next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def rank_update(user_id):

    db = MySQL_Database()

    badge_count = db.update('UPDATE registered_users AS u SET rank=(SELECT (COUNT(DISTINCT ct.walk_id) + 1) FROM completed_trips AS ct WHERE ct.user_id = %s) WHERE u.user_id = %s;', [user_id, user_id])

    return badge_count
