from . import db
from .base_mixin import BaseMixin


class Course(db.Model, BaseMixin):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
