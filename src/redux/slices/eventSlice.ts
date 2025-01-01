"use client";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { setIsLoaderFalse, setIsLoaderTrue } from "./commonSlice";
import { getAllCategoryService } from "@/services/categoryService";
import { getAllEventService } from "@/services/eventService";

export interface Event {
  _id: string;
  title: string;
  description: string;
  imageUrl: string[];
  startDateTime: string;
  endDateTime: string;
  price: string;
  isFree: boolean;
  category: string;
  organizer: string;
  createdAt: string;
  __v: number;
}

interface EventState {
  events: Event[];
}

const initialState: EventState = {
  events: [],
};

export const eventSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    getAllEventsSuccess: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
  },
});

const { getAllEventsSuccess } = eventSlice.actions;
export default eventSlice.reducer;

export const getAllEventData =
  (page: number, perPage: number) => async (dispatch: AppDispatch) => {
    try {
      await dispatch(setIsLoaderTrue());
      let response: any = await getAllEventService(page, perPage);
      if (response.success === true) {
        await dispatch(getAllEventsSuccess(response.data));
      }
      await dispatch(setIsLoaderFalse());
    } catch (e: any) {
      await dispatch(setIsLoaderFalse());
      if (e.code === 500) {
        console.log("error,", e);
      }
    }
  };
