import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

export const globalStore = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
