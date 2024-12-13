import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  value: ""
};

export const gameslice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    searchedgamevalue: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { searchedgamevalue } = gameslice.actions;
export default gameslice.reducer;