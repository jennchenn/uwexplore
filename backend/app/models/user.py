from mongoengine import Document, ListField, ObjectId, ObjectIdField, StringField


class User(Document):
    _id = ObjectIdField(required=True, default=ObjectId)
    auth_id = StringField(required=True)
    name = StringField(required=True)
    grad_year = StringField()  # fk?
    program = ObjectIdField()  # fk?
    schedules = ListField(ObjectIdField())

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
