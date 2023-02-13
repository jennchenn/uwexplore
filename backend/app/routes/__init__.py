def init_app(app):
    from . import course_routes
    from . import auth_routes
    from . import user_routes

    app.register_blueprint(course_routes.blueprint)
    app.register_blueprint(auth_routes.blueprint)
    app.register_blueprint(user_routes.blueprint)
