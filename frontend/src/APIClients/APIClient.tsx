import axios from "axios";

export class APIError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

const APIClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});

export default APIClient;
