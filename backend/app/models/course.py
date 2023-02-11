from mongoengine import (
    Document,
    DoubleField,
    EmbeddedDocumentListField,
    Enum,
    EnumField,
    ObjectId,
    ObjectIdField,
    StringField,
)

from .section import Section


class CourseType(Enum):
    TE = "TE"
    LIST_A = "LIST A"
    LIST_B = "LIST B"
    LIST_C = "LIST C"
    LIST_D = "LIST D"
    REQUIRED = "REQUIRED"


class Course(Document):
    _id = ObjectIdField(required=True, default=ObjectId)
    name = StringField(required=True)
    department = StringField(required=True)
    code = StringField(required=True)
    description = StringField(required=True)
    cse_weight = DoubleField(required=True)
    ceab_math = DoubleField(required=True)
    ceab_sci = DoubleField(required=True)
    ceab_eng = DoubleField(required=True)
    ceab_design = DoubleField(required=True)
    course_type = EnumField(CourseType)
    sections = EmbeddedDocumentListField(Section)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict

    meta = {"collection": "courses"}
