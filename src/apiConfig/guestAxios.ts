"use client";

import axios from "axios";
import { config } from "./config";

var guestAxiosInstance = axios.create({
  baseURL: config.API_URL,
});
guestAxiosInstance.interceptors.request.use((request: any) => {
  return request;
});
guestAxiosInstance.interceptors.response.use(
  (response: any) => {
    return response.data;
  },
  (error: any) => {
    const errorObject = {
      code: 500,
      message: "Server not responding",
    };
    if (error.response) {
      errorObject.code = error.response.status;
      errorObject.message = error.response.data;
      return Promise.reject(errorObject);
    } else if (error.request) {
      return Promise.reject(errorObject);
    } else {
      errorObject.message = "Something went wrong";
      return Promise.reject(errorObject);
    }
  }
);

export default guestAxiosInstance;
