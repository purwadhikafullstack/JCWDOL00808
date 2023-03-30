import { configureStore } from "@reduxjs/toolkit";
import { adminsReducer } from "./adminsReducer";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import { warehousesReducer } from "./warehousesReducer";

export const globalStore = configureStore({
  reducer: {
    adminsReducer,
    warehousesReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});
