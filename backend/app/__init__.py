import os

from flask import Flask
from flask.cli import ScriptInfo
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_sqlalchemy import SQLAlchemy

from .config import app_config


def create_app(config_name):
    app = Flask(__name__)
    if type(config_name) is not ScriptInfo:
        app.config.from_object(app_config[config_name])

    app.config["CORS_ORIGINS"] = [
        "http://localhost:3000",
    ]
    app.config["CORS_SUPPORTS_CREDENTIALS"] = True
    CORS(app)

    default_minute_rate_limit = (
        os.getenv("BACKEND_API_DEFAULT_PER_MINUTE_RATE_LIMIT") or 15
    )
    Limiter(
        get_remote_address,
        app=app,
        default_limits=[f"{default_minute_rate_limit} per minute"],
    )

    if os.getenv("FLASK_CONFIG") != "production":
        app.config[
            "SQLALCHEMY_DATABASE_URI"
        ] = "postgresql://{username}:{password}@{host}:5432/{db}".format(
            username=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("DB_HOST"),
            db=os.getenv("POSTGRES_DB"),
        )
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    from . import models, routes

    models.init_app(app)
    routes.init_app(app)

    return app
