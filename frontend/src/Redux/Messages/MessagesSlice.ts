import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseURLDEV } from '../../ApiBaseURL/BaseUrl';

const initialState = {
  UserConversations: [] as any[],
  CurrentChatMessages: [] as any[],
  MessageLoading: false
};

export const GetUserConversations = createAsyncThunk(
  'messages/GetUserConversations',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BaseURLDEV}/api/conversations/${userId}`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const CreateNewConversation = createAsyncThunk(
  'messages/CreateConversation',
  async (conversationData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BaseURLDEV}/api/conversations`,
        conversationData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const GetChatMessages = createAsyncThunk(
  'messages/GetChatMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BaseURLDEV}/api/messages/${conversationId}`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const CreateNewMessage = createAsyncThunk(
  'messages/CreateNewMessage',
  async (messageData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BaseURLDEV}/api/messages`,
        messageData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

const MessagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action) => {},
    updateChatMessages: (state, action) => {
      state.CurrentChatMessages.push(action.payload);
    }
  },

  extraReducers: (builder) => {
    builder.addCase(GetUserConversations.fulfilled, (state, action) => {
      state.UserConversations = action.payload.conversations;
      console.log('All user Conversations are:');
      console.log(action.payload.conversations);
    });

    builder.addCase(CreateNewConversation.fulfilled, (state, action) => {
      state.UserConversations.push(action.payload.savedConversation);
    });

    builder.addCase(GetChatMessages.fulfilled, (state, action) => {
      state.CurrentChatMessages = action.payload.conversationMsgs;
      console.log('Messages Of This Chat Are:');
      console.log(action.payload.conversationMsgs);
    });

    builder.addCase(CreateNewMessage.pending, (state, action) => {
      state.MessageLoading = true;
    });

    builder.addCase(CreateNewMessage.fulfilled, (state, action) => {
      state.CurrentChatMessages.push(action.payload.newMessage);
      state.MessageLoading = false;
    });
  }
});

export const { setMessages, updateChatMessages } = MessagesSlice.actions;
export default MessagesSlice.reducer;
