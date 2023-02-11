from mongoengine import (
    Document,
    EmbeddedDocument,
    EmbeddedDocumentField,
    Enum,
    EnumField,
    ListField,
    ObjectId,
    ObjectIdField,
    StringField,
)


class Schedule(EmbeddedDocument):
    _id = ObjectIdField(required=True, default=ObjectId)
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
    _id = ObjectIdField(required=True, default=ObjectId)
    auth_id = StringField(required=True)
    name = StringField(required=True)
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
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict

    meta = {"collection": "users"}
