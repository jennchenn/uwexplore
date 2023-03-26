import axios from "axios";

export class APIError extends Error {
  __proto__ = Error;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

const APIClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default APIClient;
