import { configureStore } from "@reduxjs/toolkit";
import { adminsReducer } from "./adminsReducer";
import { warehousesReducer } from "./warehousesReducer";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";

export const globalStore = configureStore({
  reducer: {
    adminsReducer,
    warehousesReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});
