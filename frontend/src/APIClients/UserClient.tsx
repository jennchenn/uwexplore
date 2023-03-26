import APIClient, { APIError } from "./APIClient";

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
    const apiError = error as Error;
    console.log(apiError.message);
    return new APIError(apiError.message);
  }
};
const refresh = async (
  refreshToken: string,
): Promise<TokenObject | APIError> => {
  try {
    const payload = {
      refresh_token: refreshToken,
    };
    const { data } = await APIClient.post(
      `/auth/refresh`,
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return data;
  } catch (error) {
    const apiError = error as Error;
    console.log(apiError.message);
    return new APIError(apiError.message);
  }
};

const createUser = async (
  email: string,
  password: string,
): Promise<TokenObject | APIError> => {
  try {
    const payload = {
      email: email,
      password: password,
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
    const apiError = error as Error;
    console.log(apiError.message);
    return new APIError(apiError.message);
  }
};

const userClients = {
  login,
  refresh,
  createUser,
};

export default userClients;
