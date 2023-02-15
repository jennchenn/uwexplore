from enum import Enum

from mongoengine import (
    Document,
    EmbeddedDocument,
    EmbeddedDocumentField,
    EnumField,
    ListField,
    ObjectIdField,
    StringField,
)


class Schedule(EmbeddedDocument):
    _id = ObjectIdField()
    term = StringField(required=True)
    name = StringField()
    courses = ListField(ObjectIdField(), required=True)

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
    _id = StringField(required=True, primary_key=True)  # auth_id
    name = StringField(required=True)
    email = StringField(required=True)
    grad_year = StringField()
    program = StringField()
    active_schedule = EmbeddedDocumentField(Schedule)
    role = EnumField(Role, default=Role.STUDENT, required=True)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        dict.pop("_id", None)  # this is the auth_id
        return dict

    meta = {"collection": "users"}
