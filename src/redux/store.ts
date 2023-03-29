import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "./slices/counter";
import memoReducer from "./slices/memo";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    memo: memoReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
