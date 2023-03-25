import random

from ..models.course import Course
from ..models.schedule import Schedule, ScheduleCourses

COLORS = [
    "#ff6961",
    "#ffb480",
    "#e5d54a",
    "#42d6a4",
    "#08cad1",
    "#59adf6",
    "#9d94ff",
    "#c780e8",
]


class ScheduleService:
    def __init__(self, logger):
        self.logger = logger

    def get_schedule_id_by_user(self, user):
        try:
            return {"schedule_id": str(user.schedule.id)}
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get schedule id. Reason={reason if reason else str(e)}"
            )
            raise e

    def get_schedule_courses_by_user(self, user):
        try:
            schedule_id = user.schedule.id
            return self.get_courses_by_schedule_id(schedule_id)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def add_courses_to_schedule_by_user(self, user, courses):
        try:
            new_courses = []
            exceptions = []
            current_schedule = user.schedule
            course_to_color = self._map_schedule_to_course_colors(current_schedule)
            # reverse COLORS so we can pop from the end
            remaining_colors = [
                c for c in COLORS[::-1] if c not in course_to_color.values()
            ]

            for course in courses:
                course_obj = Course.objects(_id=course["course_id"]).first()
                if not course_obj:
                    exceptions.append(f"No course with id={course['course_id']}")
                    continue
                if course["course_id"] in course_to_color:
                    color = course_to_color[course["course_id"]]
                else:
                    # we've used all colors at this point, just loop from the start of colors
                    if not remaining_colors:
                        num_added_courses = len(current_schedule.courses)
                        color_idx = int(num_added_courses % len(COLORS))
                        color = COLORS[color_idx]
                    else:
                        color = remaining_colors.pop()
                    course_to_color[course["course_id"]] = color
                schedule_obj = ScheduleCourses(
                    course_id=course.course_id,
                    section_id=course.section_id,
                    color=color,
                )
                if current_schedule and self._is_duplicate_course(
                    current_schedule, schedule_obj
                ):
                    exceptions.append(
                        f"Course={course['course_id']} and section={course['section_id']} already exist in calendar."
                    )
                    continue
                new_courses.append(schedule_obj)

            if not new_courses:
                raise Exception(f"Error adding courses: {exceptions}")

            if not current_schedule:  # make new schedule
                current_schedule = Schedule(courses=new_courses)
                current_schedule.save()
                user.schedule = current_schedule
                user.save()
            else:
                current_schedule.courses.extend(new_courses)
                current_schedule.save()
            for exception in exceptions:
                self.logger.error("Error adding one or more courses: ", exception)
            return self._format_schedule_courses(current_schedule)

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to add one or more courses to schedule. Reason={reason if reason else str(e)}"
            )
            raise e

    def update_schedule_color_by_user(self, user, uid, color):
        try:
            current_schedule = user.schedule
            if not current_schedule:
                raise KeyError(f"No saved schedule for user")
            return self._update_schedule_color_by_uid(current_schedule, uid, color)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def update_schedule_colors_by_user(self, user, course_id, color):
        try:
            current_schedule = user.schedule
            if not current_schedule:
                raise KeyError(f"No saved schedule for user")
            return self._update_schedule_color_by_course_id(
                current_schedule, course_id, color
            )
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to update course in schedule. Reason={reason if reason else str(e)}"
            )
            raise e

    def delete_course_from_schedule_by_user(self, user, schedule_object_id):
        try:
            current_schedule = user.schedule
            if not current_schedule:
                raise Exception("User does not have a schedule.")
            return self._delete_course_from_schedule_by_id(
                current_schedule, schedule_object_id
            )
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def delete_courses_from_schedule_by_user(self, user, course_id):
        try:
            current_schedule = user.schedule
            if not current_schedule:
                raise Exception("User does not have a schedule.")
            return self._delete_courses_from_schedule_by_course_id(
                current_schedule, course_id
            )
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def get_courses_by_schedule_id(self, schedule_id):
        try:
            current_schedule = Schedule.objects(id=schedule_id).first()
            if not current_schedule:
                raise KeyError(f"No saved schedule with id={schedule_id}")
            return self._format_schedule_courses(current_schedule)
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def create_new_schedule(self, term="1229"):
        try:
            schedule = Schedule(term=term, courses=[]).save()
            return {"schedule_id": str(schedule.id)}
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to get courses. Reason={reason if reason else str(e)}"
            )
            raise e

    def add_courses_to_schedule_by_id(self, schedule_id, courses):
        try:
            new_courses = []
            exceptions = []
            current_schedule = Schedule.objects(id=schedule_id).first()
            course_to_color = self._map_schedule_to_course_colors(current_schedule)
            # reverse COLORS so we can pop from the end
            remaining_colors = [
                c for c in COLORS[::-1] if c not in course_to_color.values()
            ]
            for course in courses:
                course_obj = Course.objects(_id=course["course_id"]).first()
                if not course_obj:
                    exceptions.append(f"No course with id={course['course_id']}")
                    continue
                if course["course_id"] in course_to_color:
                    color = course_to_color[course["course_id"]]
                else:
                    # we've used all colors at this point, just loop from the start of colors
                    if not remaining_colors:
                        num_added_courses = len(current_schedule.courses)
                        color_idx = int(num_added_courses % len(COLORS))
                        color = COLORS[color_idx]
                    else:
                        color = remaining_colors.pop()
                    course_to_color[course["course_id"]] = color
                schedule_obj = ScheduleCourses(
                    course_id=course["course_id"],
                    section_id=course["section_id"],
                    color=color,
                )
                if current_schedule and self._is_duplicate_course(
                    current_schedule, schedule_obj
                ):
                    exceptions.append(
                        f"Course={course['course_id']} and section={course['section_id']} already exist in calendar."
                    )
                    continue
                new_courses.append(schedule_obj)

            if not new_courses:
                raise Exception(f"Error adding courses: {exceptions}")

            if not current_schedule:  # make new schedule
                current_schedule = Schedule(courses=new_courses)
                current_schedule.save()
            else:
                current_schedule.courses.extend(new_courses)
                current_schedule.save()
            for exception in exceptions:
                self.logger.error("Error adding one or more courses: ", exception)
            return self._format_schedule_courses(current_schedule)

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to add one or more courses to schedule. Reason={reason if reason else str(e)}"
            )
            raise e

    def update_schedule_color_by_id(self, schedule_id, uid, color):
        try:
            current_schedule = Schedule.objects(id=schedule_id).first()
            if not current_schedule:
                raise KeyError(
                    f"No saved schedule with id={schedule_id} with item uid={schedule_id}"
                )
            return self._update_schedule_color_by_uid(current_schedule, uid, color)

        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to update course in schedule. Reason={reason if reason else str(e)}"
            )
            raise e

    def update_schedule_colors_by_id(self, schedule_id, course_id, color):
        try:
            current_schedule = Schedule.objects(id=schedule_id).first()
            if not current_schedule:
                raise KeyError(
                    f"No saved schedule with id={schedule_id} with item uid={schedule_id}"
                )
            return self._update_schedule_color_by_course_id(
                current_schedule, course_id, color
            )
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to update course in schedule. Reason={reason if reason else str(e)}"
            )
            raise e

    def delete_course_from_schedule_by_id(self, schedule_id, schedule_object_id):
        try:
            current_schedule = Schedule.objects(id=schedule_id).first()
            if not current_schedule:
                raise KeyError(f"No schedule with id={schedule_id}")
            return self._delete_course_from_schedule_by_id(
                current_schedule, schedule_object_id
            )
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to add course to schedule. Reason={reason if reason else str(e)}"
            )
            raise e

    def delete_courses_from_schedule_by_id(self, schedule_id, course_id):
        try:
            current_schedule = Schedule.objects(id=schedule_id).first()
            if not current_schedule:
                raise KeyError(f"No schedule with id={schedule_id}")
            return self._delete_courses_from_schedule_by_course_id(
                current_schedule, course_id
            )
        except Exception as e:
            reason = getattr(e, "message", None)
            self.logger.error(
                f"Failed to add course to schedule. Reason={reason if reason else str(e)}"
            )
            raise e

    def _is_duplicate_course(self, schedule, new_course):
        for course in schedule.courses:
            if course.section_id == new_course.section_id:
                return True
        return False

    def _delete_course_from_schedule_by_id(self, current_schedule, schedule_object_id):
        current_schedule.courses = list(
            filter(lambda x: str(x._id) != schedule_object_id, current_schedule.courses)
        )
        current_schedule.save()
        return self._format_schedule_courses(current_schedule)

    def _delete_courses_from_schedule_by_course_id(self, current_schedule, course_id):
        current_schedule.courses = list(
            filter(lambda x: str(x.course_id) != course_id, current_schedule.courses)
        )
        current_schedule.save()
        return self._format_schedule_courses(current_schedule)

    def _update_schedule_color_by_uid(self, current_schedule, uid, color):
        for course in current_schedule.courses:
            if str(course._id) == uid:
                course.color = color
        current_schedule.save()
        return self._format_schedule_courses(current_schedule)

    def _update_schedule_color_by_course_id(self, current_schedule, course_id, color):
        for course in current_schedule.courses:
            if str(course.course_id) == course_id:
                course.color = color
        current_schedule.save()
        return self._format_schedule_courses(current_schedule)

    def _format_schedule_courses(self, current_schedule):
        courses = []
        scheduled_courses = [
            course.to_serializable_dict() for course in current_schedule.courses
        ]
        for course_info in scheduled_courses:
            course_obj = Course.objects(_id=course_info["course_id"]).first()
            sections = course_obj.sections
            course = dict(course_obj.to_serializable_dict())
            course["sections"] = [
                self._find_section(sections, course_info["section_id"])
            ]
            course["color"] = course_info["color"]
            course["uid"] = course_info[
                "id"
            ]  # this is the ID that references the specific entry in the user schedule
            courses.append(course)
        return courses

    def _find_section(self, sections, section_id):
        for section in sections:
            if str(section._id) == section_id:
                return section.to_serializable_dict()

    def _map_schedule_to_course_colors(self, schedule):
        course_to_color = {}
        for course in schedule.courses:
            course_to_color[str(course.course_id)] = course.color
        return course_to_color
