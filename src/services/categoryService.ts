import gauestAxiosInstance from "@/apiConfig/guestAxios";

export const getAllCategoryService = () => {
  return gauestAxiosInstance.get("/category");
};

export const addNewCategoryService = (body: any) => {
  return gauestAxiosInstance.post("/category", body);
};
