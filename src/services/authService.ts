import gauestAxiosInstance from "@/apiConfig/guestAxios";

export const signinService = (data: any) => {
  return gauestAxiosInstance.post("/signin", data);
};

export const signupService = (data: any) => {
  return gauestAxiosInstance.post("/signup", data);
};

export const signoutService = () => {
  return gauestAxiosInstance.get("/logout");
};
