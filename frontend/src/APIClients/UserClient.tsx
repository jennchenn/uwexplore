import APIClient from "./APIClient";
import axios, { AxiosError } from "axios";

export type ScheduleObject = {
  term: string;
  courses: object[];
};

export type UserObject = {
  auth_id: string;
  name: string;
  email: string;
  grad_year: string;
  program: string;
  schedule: ScheduleObject;
  role: string;
  saved_courses: string[];
  past_courses: { [term: string]: string[] };
};

const getUser = async (
  email: string,
): Promise<UserObject | AxiosError | Error> => {
  try {
    const { data } = await APIClient.get(`/users${email}`);
    return data;
  } catch (error) {
    let errors: AxiosError<any> | Error;
    if (axios.isAxiosError(error)) {
      errors = error as AxiosError;
      console.log(`Axios Error: ${errors.message}`);
    } else {
      errors = error as Error;
      console.log(`Error: ${errors.message}`);
    }
    return errors;
  }
};

const clients = {
  getUser,
};
export default clients;
