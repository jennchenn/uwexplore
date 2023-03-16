import os

import firebase_admin
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

    app.config["MONGODB_URL"] = (
        os.getenv("TEST_MONGODB_URL")
        if app.config["TESTING"]
        else os.getenv("MONGODB_URL")
    )

    if config_name != "production":
        Limiter(
            get_remote_address,
            app=app,
            storage_uri=app.config["MONGODB_URL"],
            strategy="fixed-window",
        )

    firebase_admin.initialize_app(
        firebase_admin.credentials.Certificate(
            {
                "type": "service_account",
                "project_id": os.getenv("FIREBASE_PROJECT_ID"),
                "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
                "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
                "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
                "client_id": os.getenv("FIREBASE_CLIENT_ID"),
                "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
                "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
                "auth_provider_x509_cert_url": os.getenv(
                    "FIREBASE_AUTH_PROVIDER_X509_CERT_URL"
                ),
                "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
            }
        ),
    )

    app.config.update(
        MAIL_SERVER=os.getenv("MAIL_SERVER"),
        MAIL_PORT=int(os.getenv("MAIL_PORT")),
        MAIL_USE_SSL=bool(os.getenv("MAIL_USE_SSL")),
        MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
        MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    )

    from . import models, routes

    models.init_app(app)
    routes.init_app(app)

    return app
