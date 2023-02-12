def init_app(app):
    from . import course_routes
    from . import auth_routes

    app.register_blueprint(course_routes.blueprint)
    app.register_blueprint(auth_routes.blueprint)
