import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const userLogin = createAsyncThunk(
  "user/login",
  async (dataInput: { email: string; password: string }) => {
    try {
      const resp = await axios.post(
        process.env.REACT_APP_URL + "users/login",
        { email: dataInput.email, password: dataInput.password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      //    console.log("Resp.data", resp.data);

      return resp.data;
    } catch (error: any) {
      //   console.log("Error", error.response.status);
      return error.response.data;
    }
  }
);

export const createUser = createAsyncThunk(
  "user/create",
  async (dataInput: { email: string; password: string }) => {
    try {
      const resp = await axios.post(
        process.env.REACT_APP_URL + "user",
        { email: dataInput.email, password: dataInput.password },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      console.log("Resp.data", resp.data);

      return resp.data;
    } catch (error: any) {
      console.log("Error", error.response.status);
      return error.response.data;
    }
  }
);

interface IInitialState {
  success?: boolean;
  loading?: boolean;
  uid: string;
  create_status: string;
  login_status: string;
}

const initialState: IInitialState = {
  success: false,
  loading: false,
  uid: "",
  create_status: "",
  login_status: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserSuccess: (state) => {
      state.success = false;
    },
    clearCreateStatus: (state) => {
      state.create_status = "";
    },
    clearLoginStatus: (state) => {
      state.login_status = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state, action) => {
      state.loading = true;
      state.success = false;
    });

    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      // state.uid = action.payload;
      //console.log("AAA", action.payload);

      state.login_status = action.payload;
    });

    builder.addCase(createUser.pending, (state, action) => {
      state.loading = true;
      state.success = false;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      // state.success = true;
      state.create_status = action.payload;
    });
  },
});

export const { clearUserSuccess, clearCreateStatus, clearLoginStatus } =
  userSlice.actions;
export default userSlice.reducer;
