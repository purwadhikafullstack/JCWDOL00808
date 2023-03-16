import { configureStore } from "@reduxjs/toolkit";
import { adminsReducer } from "./adminsReducer";
import { warehousesReducer } from "./warehousesReducer";

export const globalStore = configureStore({
  reducer: {
    adminsReducer,
    warehousesReducer,
  },
});
