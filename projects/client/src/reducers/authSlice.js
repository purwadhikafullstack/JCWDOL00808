import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/login`,
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response?.data?.data?.token);
      return response?.data?.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        rejectWithValue(error.response.data.message);
      } else {
        rejectWithValue(error.message);
      }
    }
  }
);

const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const initialState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  user: null,
  token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.isError = null;
    },
    extraReducers: {
      [userLogin.pending]: (state) => {
        state.isLoading = true;
      },
      [userLogin.fulfilled]: (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.token = action.payload.token;
      },
      [userLogin.rejected]: (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      },
    },
  },
});

export default authSlice.reducer;
