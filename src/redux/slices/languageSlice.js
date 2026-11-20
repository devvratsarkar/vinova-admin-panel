import { createSlice } from "@reduxjs/toolkit";

// totalLanguages is country-specific - always start empty, populated from gData + country in header
const initialState = {
  totalLanguages: [],
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguages: (state, action) => {
      state.totalLanguages = action.payload;
    },
  },
});

export const { setLanguages } = languageSlice.actions;

export default languageSlice.reducer;
