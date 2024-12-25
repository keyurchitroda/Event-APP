"use client";

import Cookies from "js-cookie";

export const setCookie = (name: string, token: string, expireTime?: any) => {
  Cookies.set(name, token, { expires: expireTime });
};

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const removeCookie = (name: string) => {
  return Cookies.remove(name);
};
