from flask import redirect, render_template, request, session, url_for
from flask_session import Session
from functools import wraps


def login_required(f):
    """
    Decorate routes which require login
    :param f: 
    :return f(*args, **kwargs) OR redirection to login page: 
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        print(session.get("user_id"))
        if session.get("user_id") is None:
            print("failed because of login_required")
            return redirect(url_for("login", next=request.url))
        return f(*args, **kwargs)
    return decorated_function
