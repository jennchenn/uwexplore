from mongoengine import Document, IntField, ObjectId, ObjectIdField


class Requirement(Document):
    _id = ObjectIdField(required=True, default=ObjectId)
    grad_year = IntField(required=True)
    cse_a = IntField(required=True)
    cse_b = IntField(required=True)
    cse_c = IntField(required=True)
    cse_d = IntField(required=True)
    min_cse = IntField(required=True)
    min_te = IntField(required=True)
    min_cse_te = IntField(required=True)
    cse_weight = IntField(required=True)
    math = IntField(required=True)
    sci = IntField(required=True)
    eng_sci = IntField(required=True)
    eng_design = IntField(required=True)
    min_math_sci = IntField(required=True)
    min_eng_sci_des = IntField(required=True)

    def to_serializable_dict(self):
        """
        Returns a dict representation of the document that is JSON serializable
        ObjectId must be converted to a string.
        """
        dict = self.to_mongo().to_dict()
        id = dict.pop("_id", None)
        dict["id"] = str(id)
        return dict

    meta = {"collection": "requirements"}
