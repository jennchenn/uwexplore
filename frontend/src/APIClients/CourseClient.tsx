import APIClient from "./APIClient";
import axios, { AxiosError } from "axios";

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
  try {
    const { data } = await APIClient.get(`/courses${queryParams}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log(`Axios Error: ${axiosError.message}`);
    } else {
      const otherError = error as Error;
      console.log(`Error: ${otherError.message}`);
    }
    return [];
  }
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
