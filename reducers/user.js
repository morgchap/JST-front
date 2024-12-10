import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  value: { username: '', token: '' },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUsername: (state, action) => {
      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
    },
  },
});

export const { updateUsername } = userSlice.actions;
export default userSlice.reducer;
