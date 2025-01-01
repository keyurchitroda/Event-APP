import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  UIGlobalLoader: false,
  isAddToCartOpen: false,
};

export const UILoader = createSlice({
  name: "loader",
  initialState,
  reducers: {
    isLoadingTrue: (state, action) => {
      state.UIGlobalLoader = true;
    },
    isLoadingFalse: (state, action) => {
      state.UIGlobalLoader = false;
    },
    setAddToCart: (state, action) => {
      state.isAddToCartOpen = action.payload;
    },
  },
});

const { isLoadingTrue, isLoadingFalse, setAddToCart } = UILoader.actions;
export default UILoader.reducer;

export const setIsLoaderTrue = () => async (dispatch) => {
  dispatch(isLoadingTrue());
};

export const setIsLoaderFalse = () => async (dispatch) => {
  dispatch(isLoadingFalse());
};

export const setAddToCartValue = (isOpen) => async (dispatch) => {
  await dispatch(setAddToCart(isOpen));
};
