def init_app(app):
    from . import course_routes

    app.register_blueprint(course_routes.blueprint)
