"use client";

import axios from "axios";
import { config } from "./config";
import { getCookie } from "./cookies";
import { defaultAuthTokenString, defaultTokenString } from "@/helpers/helper";

// passing full url to axios overwrite baseUrl

var axiosInstance = axios.create({
  baseURL: config.API_URL,
});
axiosInstance.interceptors.request.use((request) => {
  const token = getCookie(defaultAuthTokenString);
  if (token) {
    request.headers.Authorization = token;
  }
  return request;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: any) => {
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

export default axiosInstance;
