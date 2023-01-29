from ..models.course import Course


class CourseService:
    def __init__(self, logger):
        self.logger = logger

    def get_courses(self):
        courses = []

        for result in Course.objects:
            result_dict = result.to_serializable_dict()
            courses.append(result_dict)

        return courses
