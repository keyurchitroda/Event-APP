"use client";

import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import categoryReducer from "./slices/categorySlice";
import commonReducer from "./slices/commonSlice";
import eventReducer from "./slices/eventSlice";

// Define a logout action
export const logout = createAction("LOGOUT");

// Reducer that listens to the logout action to reset the state
const appReducer = createReducer({}, (builder) => {
  builder.addCase(logout, () => ({})); // Reset the entire state
});

const reducers = combineReducers({
  categoryReducer,
  commonReducer,
  eventReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [""], // only these reducers will be persisted
  blacklist: ["categoryReducer", "commonReducer", "eventReducer"],
};

const persistedReducer: any = persistReducer(persistConfig, reducers);

const rootReducer = (state: any, action: any) => {
  if (action.type === "LOGOUT") {
    state = undefined;
  }
  return persistedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
