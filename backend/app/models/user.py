from enum import Enum

from bson.objectid import ObjectId
from mongoengine import (
    Document,
    EmbeddedDocument,
    EmbeddedDocumentField,
    EnumField,
    ListField,
    ObjectIdField,
    StringField,
)


class ScheduleCourses(EmbeddedDocument):
    _id = ObjectIdField(required=True, default=ObjectId, primary_key=True)
    course_id = ObjectIdField(required=True)
    section_id = ObjectIdField(required=True)
    color = StringField(required=True)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict


class Schedule(EmbeddedDocument):
    _id = ObjectIdField(required=True, default=ObjectId, primary_key=True)
    term = StringField(required=True)
    name = StringField()
    courses = ListField(EmbeddedDocumentField(ScheduleCourses), required=True)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict


class Role(Enum):
    STUDENT = "STUDENT"
    ADMIN = "ADMIN"


class User(Document):
    auth_id = StringField(required=True)
    name = StringField(required=True)
    email = StringField(required=True, unique=True)
    grad_year = StringField()
    program = StringField()
    schedule = EmbeddedDocumentField(Schedule)
    role = EnumField(Role, default=Role.STUDENT, required=True)
    saved_courses = ListField(ObjectIdField())
    past_courses = ListField(ObjectIdField())

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        dict.pop("auth_id", None)
        return dict

    meta = {"collection": "users"}
