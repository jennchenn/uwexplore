import os

from flask import Flask
from flask.cli import ScriptInfo
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

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

    app.config["MONGODB_URL"] = os.getenv("MONGODB_URL")

    Limiter(
        get_remote_address,
        app=app,
        storage_uri=app.config["MONGODB_URL"],
        strategy="fixed-window",
    )

    from . import models, routes

    models.init_app(app)
    routes.init_app(app)

    return app
