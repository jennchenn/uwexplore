def init_app(app):
    from . import auth_routes, ceab_routes, course_routes, schedule_routes, user_routes

    app.register_blueprint(auth_routes.blueprint)
    app.register_blueprint(ceab_routes.blueprint)
    app.register_blueprint(course_routes.blueprint)
    app.register_blueprint(schedule_routes.blueprint)
    app.register_blueprint(user_routes.blueprint)
