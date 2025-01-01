import gauestAxiosInstance from "@/apiConfig/guestAxios";

export const creteEventService = (data: any) => {
  return gauestAxiosInstance.post("/events", data);
};

export const getAllEventService = (page: number, perPage: number) => {
  return gauestAxiosInstance.get(`/events?page=${page}&per_page=${perPage}`);
};
