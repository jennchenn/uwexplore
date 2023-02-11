from mongoengine import (
    DateTimeField,
    Document,
    DoubleField,
    Enum,
    EnumField,
    IntField,
    ListField,
    ObjectId,
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
    LEC = "LECTURE"
    TUT = "TUTORIAL"
    LAB = "LAB"


class Section(Document):
    _id = ObjectIdField(required=True, default=ObjectId)
    day = ListField(EnumField(Weekday), required=True)
    term_code = StringField(required=True)
    start_time = DoubleField(required=True)
    end_time = DoubleField(required=True)
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

    meta = {"collection": "sections"}
