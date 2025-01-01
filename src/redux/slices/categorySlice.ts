"use client";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { setIsLoaderFalse, setIsLoaderTrue } from "./commonSlice";
import { getAllCategoryService } from "@/services/categoryService";

interface Category {
  _id: string;
  category_name: string;
  category_image: string;
  status: boolean;
}

interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

export const categroySlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    getAllCategorySuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
});

const { getAllCategorySuccess } = categroySlice.actions;
export default categroySlice.reducer;

export const getAllCategory = () => async (dispatch: AppDispatch) => {
  try {
    await dispatch(setIsLoaderTrue());
    let response: any = await getAllCategoryService();
    if (response.success === true) {
      await dispatch(getAllCategorySuccess(response.data));
    }
    await dispatch(setIsLoaderFalse());
  } catch (e: any) {
    await dispatch(setIsLoaderFalse());
    if (e.code === 500) {
      console.log("error,", e);
    }
  }
};
