import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface NoteInitialState {
  success?: boolean;
  loading?: boolean;
}

const initialState: NoteInitialState = {
  success: false,
  loading: false,
};

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearUserSuccess: (state) => {
      state.success = false;
    },
  },
});

export const { clearUserSuccess } = noteSlice.actions;
export default noteSlice.reducer;
