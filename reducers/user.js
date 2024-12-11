import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  value: { username: '', token: '', lists: [] },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUsername: (state, action) => {
      state.value.username = action.payload.username;
      state.value.token = action.payload.token;
    },
    addListGames: (state, action) => {
      state.value.lists = [...action.payload]
    },
    addGame: (state, action) => {
      state.value.lists = [...state.value.lists, action.payload]
    },
    deleteGame: (state, action) => {
      state.value.lists = state.value.lists.filter(e => e.listName !== action.payload);
    }
  },
});

export const { updateUsername, addListGames, addGame, deleteGame } = userSlice.actions;
export default userSlice.reducer;
