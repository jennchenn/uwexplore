from mongoengine import connect


def init_app(app):
    app.app_context().push()
    # connect to MongoDB
    if "MONGODB_URL" in app.config:
        print("Connecting to db...")
        connect(host=app.config["MONGODB_URL"])
        print("Connected!")
