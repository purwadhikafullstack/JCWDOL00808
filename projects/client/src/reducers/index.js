import { configureStore } from "@reduxjs/toolkit";
import { adminsReducer } from "./adminsReducer";
import { warehousesReducer } from "./warehousesReducer";
import cartReducer from "./cartSlice";

export const globalStore = configureStore({
  reducer: {
    adminsReducer,
    warehousesReducer,
    cart: cartReducer,
  },
});
