import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURLDEV } from '../../ApiBaseURL/BaseUrl';

const initialState = {
  commentsLoading: false,
  CurrentComments: []
};

export const CreatePostComment = createAsyncThunk(
  'comments/CreatePostComment',
  async (commentData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BaseURLDEV}/api/comments`,
        commentData
      );
      console.log('Slice Comments Create Comment');
      console.log(response);

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const GetPostComments = createAsyncThunk(
  'comments/GetPostComment',
  async (postId: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURLDEV}/api/comments/${postId}`);
      console.log('Slice Comments Get Comments:');
      console.log(response);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

const CommentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {}
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetPostComments.pending, (state, action) => {
        state.commentsLoading = true;
      })
      .addCase(GetPostComments.fulfilled, (state, action) => {
        state.CurrentComments = action.payload.comments;
        state.commentsLoading = false;
      })
      .addCase(GetPostComments.rejected, (state, action) => {
        state.commentsLoading = false;
      });
  }
});

export const { setComments } = CommentsSlice.actions;
export default CommentsSlice.reducer;
