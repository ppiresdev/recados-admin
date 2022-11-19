import { configureStore } from "@reduxjs/toolkit";
import combinedReducers from "./rootReducer";

export const store = configureStore({
  // reducer: {
  //   cart: cartReducer,
  // },
  reducer: combinedReducers,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
