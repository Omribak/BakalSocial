import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURLDEV } from '../../ApiBaseURL/BaseUrl';
import { RegValues } from '../../Pages/AuthPages/RegisterPage/constants';

export interface PostData {
  _id: string;
  userId: string;
  postDescription: string;
  postImage?: string;
  createdAt: any;
  likes: any;
  user: any;
  NumComments: number;
  comments: any;
}

interface PostsState {
  isLoadingPosts: boolean;
  TimelinePosts: PostData[];
}

const initialState: PostsState = {
  isLoadingPosts: false,
  TimelinePosts: []
};

export const GetTimelinePosts = createAsyncThunk(
  'posts/getTimelinePosts',
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BaseURLDEV}/api/posts/${userId}/timeline/all`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const CreatePost = createAsyncThunk(
  'posts/CreatePost',
  async (postData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BaseURLDEV}/api/posts`, postData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const LikePost = createAsyncThunk(
  'posts/LikePost',
  async (LikeData: any, { rejectWithValue }) => {
    try {
      await axios.put(`${BaseURLDEV}/api/posts/${LikeData.postId}/like`, {
        userId: LikeData.userId
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

const PostsSlice = createSlice({
  name: 'Posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {}
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetTimelinePosts.pending, (state) => {
        state.isLoadingPosts = true;
      })
      .addCase(GetTimelinePosts.fulfilled, (state, action) => {
        state.isLoadingPosts = false;
        state.TimelinePosts = action.payload.PostArray;
      })
      .addCase(GetTimelinePosts.rejected, (state, action) => {
        state.isLoadingPosts = false;
      });
  }
});

export default PostsSlice.reducer;
