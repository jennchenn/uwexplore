import APIClient from "./APIClient";
import axios, { AxiosError } from "axios";

export type CourseObject = {
  id: string;
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
  requisites: string;
  sections: object[];
  tags: string[];
};

export type ScheduleId = {
  schedule_id: string | null;
};

export type CalendarCourseObject = CourseObject & { color: string };

const addCoursesByScheduleId = async (id: string, course: any) => {
  try {
    const { data } = await APIClient.post(`/schedules/${id}`, course, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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

const deleteCoursesByScheduleId = async (id: string, course_id: string) => {
  try {
    const { data } = await APIClient.delete(
      `/schedules/${id}/course/${course_id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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

const deleteSingleCourseByScheduleId = async (
  id: string,
  section_id: string,
) => {
  try {
    const { data } = await APIClient.delete(
      `/schedules/${id}/uid/${section_id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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

const getPastCourses = async (token: string | null) => {
  try {
    const { data } = await APIClient.get(`/courses/past`, {
      headers: { Authorization: `bearer ${token}` },
    });
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

const addPastCourses = async (
  token: string | null,
  course_id: string,
  term: string,
) => {
  try {
    const payload = {
      course_id: course_id,
      term: term,
    };
    const { data } = await APIClient.post(
      `/courses/past`,
      JSON.stringify(payload),
      {
        headers: {
          Authorization: `bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
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

const deletePastCourses = async (
  token: string | null,
  course_id: string,
  term: string,
) => {
  try {
    const payload = {
      course_id: course_id,
      term: term,
    };
    const { data } = await APIClient.delete(`/courses/past`, {
      data: JSON.stringify(payload),
      headers: { Authorization: `bearer ${token}` },
    });
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

const getScheduleId = async (idToken: string): Promise<ScheduleId> => {
  try {
    const { data } = await APIClient.get("/schedules/id", {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log(`Axios Error: ${axiosError.message}`);
    } else {
      const otherError = error as Error;
      console.log(`Error: ${otherError.message}`);
    }

    return { schedule_id: null };
  }
};

const getCoursesByScheduleId = async (
  id: string,
): Promise<CalendarCourseObject[]> => {
  try {
    const { data } = await APIClient.get(`/schedules/${id}`);
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

const updateCourseColorByScheduleId = async (
  id: string,
  course_id: string,
  color: string,
) => {
  try {
    const payload = {
      course_id: course_id,
      color: color,
    };
    const { data } = await APIClient.put(
      `/schedules/${id}`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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

const updateSectionColorByScheduleId = async (
  id: string,
  uid: string,
  color: string,
) => {
  try {
    const payload = {
      uid: uid,
      color: color,
    };
    const { data } = await APIClient.put(
      `/schedules/${id}`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
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

const courseClients = {
  addCoursesByScheduleId,
  deleteCoursesByScheduleId,
  deleteSingleCourseByScheduleId,
  getCourses,
  getPastCourses,
  addPastCourses,
  deletePastCourses,
  getScheduleId,
  getCoursesByScheduleId,
  updateCourseColorByScheduleId,
  updateSectionColorByScheduleId,
};
export default courseClients;
