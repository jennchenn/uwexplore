from enum import Enum

from bson.objectid import ObjectId
from mongoengine import (
    DateTimeField,
    Document,
    EmbeddedDocument,
    EmbeddedDocumentListField,
    EnumField,
    FloatField,
    IntField,
    ListField,
    ObjectIdField,
    StringField,
)


class Weekday(Enum):
    M = "MONDAY"
    T = "TUESDAY"
    W = "WEDNESDAY"
    TH = "THURSDAY"
    F = "FRIDAY"
    S = "SATURDAY"
    SU = "SUNDAY"


class ClassType(Enum):
    LEC = "LEC"
    TUT = "TUT"
    LAB = "LAB"
    SEM = "SEM"


class Section(EmbeddedDocument):
    _id = ObjectIdField(required=True, default=ObjectId, primary_key=True)
    day = ListField(EnumField(Weekday), required=True)
    term_code = StringField(required=True)
    instructor = StringField()
    start_time = FloatField(required=True)
    end_time = FloatField(required=True)
    class_number = IntField(required=True)  # 4178
    location = StringField(required=True)  # E5 6008
    type = EnumField(ClassType, required=True)  # LEC
    number = StringField(required=True)  # 001
    start_date = DateTimeField(required=True)
    end_date = DateTimeField(required=True)
    enrolled_number = IntField()
    capacity = IntField()

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict


class CourseType(Enum):
    TE = "TE"
    LIST_A = "LIST A"
    LIST_B = "LIST B"
    LIST_C = "LIST C"
    LIST_D = "LIST D"
    REQUIRED = "REQUIRED"


class Course(Document):
    _id = ObjectIdField()
    name = StringField(required=True)
    department = StringField(required=True)
    code = StringField(required=True)
    description = StringField(required=True)
    cse_weight = FloatField(required=True, default=0.0)
    ceab_math = FloatField(required=True, default=0.0)
    ceab_sci = FloatField(required=True, default=0.0)
    ceab_eng = FloatField(required=True, default=0.0)
    ceab_design = FloatField(required=True, default=0.0)
    course_type = EnumField(CourseType)
    sections = EmbeddedDocumentListField(Section)
    prerequisites = ListField(StringField())
    antirequisites = ListField(StringField())
    tags = ListField(StringField())

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        for section in dict.get("sections", []):
            id = section.pop("_id", None)
            section["id"] = str(id)
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict

    meta = {"collection": "courses"}
