import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  value: { username: '', token: '' },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUsername: (state, action) => {
      state.value.username = action.payload;
      state.value.token = action.payload;
    },
  },
});

export const { updateUsername } = userSlice.actions;
export default userSlice.reducer;
