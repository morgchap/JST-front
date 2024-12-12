import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  value: ""
};

export const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    clickedFriend: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { clickedFriend } = friendSlice.actions;
export default friendSlice.reducer;
