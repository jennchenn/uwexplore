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

export type TokenObject = {
  id_token: string;
  refresh_token: string;
};

const login = async (email: string, password: string) => {
  try {
    const payload = {
      email: email,
      password: password,
    };
    const { data } = await APIClient.post(
      `/auth/login`,
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

const createUser = async (email: string, password: string) => {
  try {
    const payload = {
      name: "",
      email: email,
      password: password,
      grad_year: 2022,
      program: "SYDE",
      role: "STUDENT",
      sign_up_method: "PASSWORD",
    };
    const { data } = await APIClient.post(
      `/auth/signup`,
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

const clients = {
  login,
  createUser,
};

export default clients;
