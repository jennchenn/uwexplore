from mongoengine import Document, ObjectId, ObjectIdField, StringField


class Department(Document):
    _id = ObjectIdField(required=True, default=ObjectId)
    name = StringField(required=True)
    abbreviation = StringField(required=True)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict

    meta = {"collection": "departments"}
