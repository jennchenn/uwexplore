from enum import Enum

from mongoengine import (
    Document,
    EmbeddedDocument,
    EmbeddedDocumentField,
    EnumField,
    ListField,
    ObjectIdField,
    ReferenceField,
    StringField,
)

from .schedule import Schedule


class PastCourses(EmbeddedDocument):
    term_1a = ListField(ObjectIdField())
    term_1b = ListField(ObjectIdField())
    term_2a = ListField(ObjectIdField())
    term_2b = ListField(ObjectIdField())
    term_3a = ListField(ObjectIdField())
    term_3b = ListField(ObjectIdField())
    term_4a = ListField(ObjectIdField())
    term_4b = ListField(ObjectIdField())
    term_other = ListField(ObjectIdField())

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
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
    schedule = ReferenceField(Schedule)
    role = EnumField(Role, default=Role.STUDENT, required=True)
    saved_courses = ListField(ObjectIdField())
    past_courses = EmbeddedDocumentField(PastCourses)

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
