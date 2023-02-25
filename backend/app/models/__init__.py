from mongoengine import connect


def init_app(app):
    app.app_context().push()
    # connect to MongoDB
    if "MONGODB_URL" in app.config:
        print("Connecting to db...")
        try:
            connect(host=app.config["MONGODB_URL"])
            print("Connected!")
        except Exception as e:
            error_message = getattr(e, "message", None)
            print(f"Failed to connect to db. Reason={error_message}")
