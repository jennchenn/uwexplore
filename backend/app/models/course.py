from mongoengine import Document, IntField, StringField


class Course(Document):
    name = StringField(required=True)
    code = IntField(required=True)

    meta = {"collection": "courses"}

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict
