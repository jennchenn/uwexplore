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
    MONDAY = "M"
    TUESDAY = "T"
    WEDNESDAY = "W"
    THURSDAY = "R"
    FRIDAY = "F"
    SATURDAY = "S"
    SUNDAY = "U"
    ONLINE = "E"


class Section(EmbeddedDocument):
    _id = ObjectIdField(required=True, default=ObjectId, primary_key=True)
    # mongo saves this as a String; when we update a section, it'll throw an error if it's Enum
    # we are keeping the Weekday enum to ensure we're consistent here
    day = ListField(StringField(), required=True)
    term_code = StringField(required=True)
    term_name = StringField(required=True)  # Winter 2023
    instructor = StringField()
    start_time = FloatField()
    end_time = FloatField()
    class_number = IntField(required=True)  # 4178
    location = StringField(required=True)  # E5 6008
    type = StringField(required=True)  # LEC
    number = StringField(required=True)  # 001
    start_date = DateTimeField(required=True)
    end_date = DateTimeField(required=True)
    course_id = ObjectIdField(required=True)
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
        course_id = dict.pop("course_id", None)
        dict["course_id"] = str(course_id)
        return dict


class CourseType(Enum):
    TE = "TE"
    LIST_A = "LIST A"
    LIST_B = "LIST B"
    LIST_C = "LIST C"
    LIST_D = "LIST D"
    CSE = "CSE"
    PD_COMP = "PD COMP"
    PD_ELEC = "PD ELEC"


class Course(Document):
    _id = ObjectIdField()
    name = StringField(required=True)
    department = StringField(required=True)
    code = StringField(required=True)
    full_code = StringField(required=True)
    course_id = StringField(required=True, unique=True)
    description = StringField(required=True)
    description_abbreviated = StringField()
    cse_weight = FloatField(required=True, default=0.0)
    ceab_math = FloatField(required=True, default=0.0)
    ceab_sci = FloatField(required=True, default=0.0)
    ceab_eng_sci = FloatField(required=True, default=0.0)
    ceab_eng_design = FloatField(required=True, default=0.0)
    course_type = EnumField(CourseType)
    sections = EmbeddedDocumentListField(Section)
    requisites = StringField()
    tags = ListField(StringField())

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        for section in dict.get("sections", []):
            id = section.pop("_id", None)
            section["id"] = str(id)
            course_id = section.pop("course_id", None)
            section["course_id"] = str(course_id)

        return dict

    meta = {"collection": "courses"}
