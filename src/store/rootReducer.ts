import { combineReducers } from "@reduxjs/toolkit";
import noteSlice from "./reducers/slices/noteSlice";
import userSlice from "./reducers/slices/UserSlice";

const combinedReducers = combineReducers({
  user: userSlice,
  note: noteSlice,
});

export default combinedReducers;
export type TypeStore = ReturnType<typeof combinedReducers>;
