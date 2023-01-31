from mongoengine import (
    Document,
    EmbeddedDocumentField,
    EmbeddedDocumentListField,
    ObjectId,
    ObjectIdField,
    StringField,
)
from .course import Course
from .section import Section


class ActiveCourse(Document):
    _id = ObjectIdField(required=True, default=ObjectId)
    term = StringField(required=True)
    course_info = EmbeddedDocumentField(Course, required=True)
    sections = EmbeddedDocumentListField(Section, required=True)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict

    meta = {"collection": "active_courses"}
