import APIClient from "./APIClient";

export type CourseObject = {
  id: string;
  antirequisites: string[];
  ceab_eng_design: number;
  ceab_eng_sci: number;
  ceab_math: number;
  ceab_sci: number;
  code: string;
  course_id: string;
  cse_weight: number;
  department: string;
  description_abbreviated: string;
  description: string;
  full_code: string;
  name: string;
  prerequisites: string[];
  sections: object[];
  tags: string[];
};

export type CalendarCourseObject = CourseObject & { color: string };

const getCourses = async (
  queryParams: string | null,
): Promise<CourseObject[]> => {
  // FIXME: this should be thrown into a try catch
  const { data } = await APIClient.get(`/courses${queryParams}`);
  return data;
};

const getCoursesOnCalendar = async (): Promise<CalendarCourseObject[]> => {
  // FIXME: this should be thrown into a try catch
  // FIXME: add authorization header! "Authorization: Bearer <>"
  const bearerToken = "";
  const { data } = await APIClient.get("/courses/schedule", {
    headers: { Authorization: bearerToken },
  });
  return data;
};

const getCoursesByCalendarId = async (
  id: string,
): Promise<CalendarCourseObject[]> => {
  // FIXME: this should be thrown into a try catch
  const { data } = await APIClient.get(`/courses/schedules/${id}`);
  return data;
};

const clients = {
  getCourses,
  getCoursesOnCalendar,
  getCoursesByCalendarId,
};
export default clients;
