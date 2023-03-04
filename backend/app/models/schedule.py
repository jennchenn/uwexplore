from enum import Enum

from bson.objectid import ObjectId
from mongoengine import (
    Document,
    EmbeddedDocument,
    EmbeddedDocumentField,
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


class Schedule(Document):
    term = StringField(required=True)
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
