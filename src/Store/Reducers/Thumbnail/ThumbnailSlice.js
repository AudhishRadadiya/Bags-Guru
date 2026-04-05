import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  thumbnailLoading: false,
  thumbnailList: [],
  thumbnailListCount: 0,
};

const thumbnailSlice = createSlice({
  name: 'thumbnail',
  initialState,
  reducers: {
    setThumbnailLoading: (state, action) => {
      state.thumbnailLoading = action.payload;
    },
    setThumbnailList: (state, action) => {
      state.thumbnailList = action.payload;
    },
    setThumbnailListCount: (state, action) => {
      state.thumbnailListCount = action.payload;
    },
  },
});

export const { setThumbnailLoading, setThumbnailList, setThumbnailListCount } =
  thumbnailSlice.actions;

export default thumbnailSlice.reducer;
