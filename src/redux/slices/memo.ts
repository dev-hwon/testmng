import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MemoState {
  value: string;
}

const initialState: MemoState = {
  value: ''
};

export const memoSlice = createSlice({
    name: "memo",
    initialState,
    reducers: {
        setMemo: (
            state,
            action: PayloadAction<{ value: string; }>
        ) => {
          state.value = action.payload.value;
        },
    },
    extraReducers: {},
});

export const { setMemo } = memoSlice.actions;

export const memo = (state: MemoState) => state.value;

export default memoSlice.reducer;