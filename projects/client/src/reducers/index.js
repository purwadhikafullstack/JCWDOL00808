import { configureStore } from "@reduxjs/toolkit";
import { adminsReducer } from "./adminsReducer";

export const globalStore = configureStore({
  reducer: {
    adminsReducer,
  },
});
