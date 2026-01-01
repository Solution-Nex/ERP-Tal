import { createSlice } from "@reduxjs/toolkit";

export interface sidebarState {
  button: {
    text: string;
    alpha: string;
    alt: boolean;
    path?:string;
    onClick?: ()=> void;
  }[];
}

const initialState: sidebarState = {
  button: [],
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarButtons(state, action: { payload: sidebarState["button"] }) {
      state.button = action.payload;
    },
  },
});

export const { setSidebarButtons } = sidebarSlice.actions;
export default sidebarSlice.reducer;