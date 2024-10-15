import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './User/UserSlice';
import PostsReducer from './Posts/PostsSlice';
import CommentsReducer from './Comments/CommentsSlice';
import MessagesReducer from './Messages/MessagesSlice';

export const store = configureStore({
  reducer: {
    UserReducer,
    PostsReducer,
    CommentsReducer,
    MessagesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
