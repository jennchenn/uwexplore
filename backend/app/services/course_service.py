from ..models.course import Course


class CourseService:
    def __init__(self, logger):
        self.logger = logger

    def get_courses(self):
        return [course.to_dict() for course in Course.query.all()]
