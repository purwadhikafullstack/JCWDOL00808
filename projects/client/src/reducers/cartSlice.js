import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";
const token = localStorage.getItem("token");

export const getCarts = createAsyncThunk("cart/getCarts", async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/cart`,
    {
      headers: { Authorization: token },
    }
  );
  return response?.data?.data;
});

export const updateCarts = createAsyncThunk(
  "cart/updateCarts",
  async ({ id, quantity }) => {
    const response = await axios.patch(
      `${process.env.REACT_APP_API_BASE_URL}/cart`,
      { id, quantity },
      { headers: { Authorization: token } }
    );
    return response?.data?.data;
  }
);

export const deleteCarts = createAsyncThunk(
  "carts/deleteCarts",
  async ({ id }) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/cart`,
      id,
      { headers: { Authorization: token } }
    );
    return response?.data?.data;
  }
);

const cartEntity = createEntityAdapter({ selectId: (cart) => cart.id });

const cartSlice = createSlice({
  name: "cart",
  initialState: cartEntity.getInitialState(),
  extraReducers: {
    [getCarts.fulfilled]: (state, action) => {
      cartEntity.setAll(state, action.payload);
    },
    [updateCarts.fulfilled]: (state, action) => {
      action.payload.forEach((cartItem) => {
        cartEntity.updateOne(state, {
          id: cartItem.id,
          changes: cartItem,
        });
      });
    },
    [deleteCarts.fulfilled]: (state, action) => {
      cartEntity.removeOne(state, action.payload);
    },
  },
});

export const cartSelector = cartEntity.getSelectors((state) => state.cart);
export default cartSlice.reducer;
