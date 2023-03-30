import APIClient from "./APIClient";
import axios, { AxiosError } from "axios";

export type CeabCounts = {
  completed: number;
  requirement: number;
};

const getCeabByUser = async (token: string) => {
  try {
    const { data } = await APIClient.get(`/ceab/`, {
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

const ceabClients = {
  getCeabByUser,
};

export default ceabClients;
