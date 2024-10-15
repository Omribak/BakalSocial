import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURLDEV } from '../../ApiBaseURL/BaseUrl';
import { RegValues } from '../../Pages/AuthPages/RegisterPage/constants';

export interface UserData {
  username: string;
  _id: string;
  email: string;
  country: string;
  city: string;
  profilePicture: string;
  coverPicture: string;
  followers: string[];
  following: string[];
}

interface UserState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  followingUsers: any;
  followersUsers: any;
}

const initialState: UserState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  followingUsers: [],
  followersUsers: []
};

export const RegisterUser = createAsyncThunk(
  '/register',
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BaseURLDEV}/api/users/register`,
        formData,
        {
          withCredentials: true
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const LoginUser = createAsyncThunk(
  '/login',
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BaseURLDEV}/api/users/login`,
        formData,
        {
          withCredentials: true
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const UpdateUserInformation = createAsyncThunk(
  '/update',
  async (formData: any, { rejectWithValue }) => {
    console.log('FORM DATA IS:');
    console.log([...formData]);
    try {
      console.log(formData);
      const response = await axios.put(
        `${BaseURLDEV}/api/users/${formData.get('userId')}`,
        formData,

        {
          headers: {
            'Content-Type': 'multipart/form-data' // Ensure the correct content type
          },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const UpdateUserPassword = createAsyncThunk(
  '/update-password',
  async ({ id, formData }: any, { rejectWithValue }) => {
    try {
      console.log(formData);
      const response = await axios.put(
        `${BaseURLDEV}/api/users/${id}/change-password`,
        formData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const LogoutUser = createAsyncThunk('/', async () => {
  await axios.post(`${BaseURLDEV}/api/users/logout`, null, {
    withCredentials: true
  });
});

export const checkAuth = createAsyncThunk('/checkauth', async () => {
  const response = await axios.get(`${BaseURLDEV}/api/users/check-auth`, {
    withCredentials: true
  });
  return response.data;
});

export const FollowUserAPI = createAsyncThunk(
  '/FollowUserAPI',
  async ({ FollowID, userId }: any, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BaseURLDEV}/api/users/follow/${FollowID}`,
        {
          userId
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const UnFollowUserAPI = createAsyncThunk(
  '/UnFollowUserAPI',
  async ({ FollowID, userId }: any, { rejectWithValue }) => {
    try {
      console.log(userId);
      const response = await axios.put(
        `${BaseURLDEV}/api/users/unfollow/${FollowID}`,
        {
          userId
        }
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const GetFollowing = createAsyncThunk(
  '/getFollowing',
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BaseURLDEV}/api/users/${userId}/all-following`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const GetFollowers = createAsyncThunk(
  '/getFollowers',
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BaseURLDEV}/api/users/${userId}/all-followers`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUser = createAsyncThunk(
  '/getUser',
  async (userId: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BaseURLDEV}/api/users/${userId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const ForgotUserPassword = createAsyncThunk(
  '/ForgotPassword',
  async (email: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BaseURLDEV}/api/users/forgot-password`,
        email
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const ResetUserPassword = createAsyncThunk(
  '/ResetPassword',
  async ({ formData, token }: any, { rejectWithValue }) => {
    console.log(formData);
    try {
      const response = await axios.post(
        `${BaseURLDEV}/api/users/reset-password/${token}`,
        formData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const SearchFriends = createAsyncThunk(
  '/SearchFriends',
  async (searchField: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BaseURLDEV}/api/users/search-friends/${searchField}`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser: (state, action) => {}
  },
  extraReducers: (builder) => {
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(RegisterUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(RegisterUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(LoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user =
          action.payload.status === 'success' ? action.payload.user : null;
        console.log(action.payload.user);
        state.isAuthenticated =
          action.payload.status === 'success' ? true : false;
        state.isAuthenticated = true;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload.user);
        state.user =
          action.payload.status === 'success' ? action.payload.user : null;
        state.isAuthenticated =
          action.payload.status === 'success' ? true : false;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(LogoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LogoutUser.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
      })
      .addCase(LogoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder.addCase(GetFollowing.fulfilled, (state, action) => {
      state.followingUsers = action.payload.AllFollowing;
      console.log('Followings Are:');
      console.log(action.payload.AllFollowing);
    });

    builder.addCase(GetFollowers.fulfilled, (state, action) => {
      state.followersUsers = action.payload.AllFollowers;
      console.log('Followers Are:');
      console.log(action.payload);
    });

    builder.addCase(UpdateUserInformation.fulfilled, (state, action) => {
      state.user = action.payload.updatedUser;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      console.log(action.payload);
    });

    builder.addCase(FollowUserAPI.fulfilled, (state, action) => {
      if (state.user) {
        state.user.following.push(action.payload.FollowID);
      }
    });

    // Handle unfollow user success
    builder.addCase(UnFollowUserAPI.fulfilled, (state, action) => {
      if (state.user) {
        state.user.following = state.user.following.filter(
          (id) => id !== action.payload.FollowID
        );
      }
    });
  }
});

export default UserSlice.reducer;
