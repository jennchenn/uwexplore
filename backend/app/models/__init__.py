from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()


def init_app(app):
    # import models here
    from .course import Course

    app.app_context().push()
    db.init_app(app)
    migrate.init_app(app, db)

    # drop tables
    # db.reflect()
    # db.drop_all()

    # change this when alembic implemented
    db.create_all()
