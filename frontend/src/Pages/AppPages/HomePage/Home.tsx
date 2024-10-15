import React, { useEffect, useRef, useState } from 'react';
import SideNav from '../../../Components/SideNav/SideNav';
import './HomePage.css';
import Header from '../../../Components/Header/Header';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AddPostItems, DummyUserPosts, onlineFriends } from './data-structures';
import { BlueButton, GreenButton } from '../../../GlobalStyles/globalStyles';
import {
  Cake,
  ChatOutlined,
  ThumbUp,
  FiberManualRecord,
  FavoriteBorderOutlined,
  FavoriteBorder
} from '@mui/icons-material';
import { CircularProgress, Input } from '@mui/material';
import BirthdaySvg from '../../../SVGS/BirthdaySvg';
import useResponsiveType from '../../../custom-hooks/useResponsiveType';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Redux/store';
import {
  CreatePost,
  GetTimelinePosts,
  LikePost,
  PostData
} from '../../../Redux/Posts/PostsSlice';
import {
  CreatePostComment,
  GetPostComments,
  setComments
} from '../../../Redux/Comments/CommentsSlice';
import { GetFollowers, GetFollowing } from '../../../Redux/User/UserSlice';
import { PulseLoader, SyncLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'timeago.js';
import FeedSection from '../../../Components/HomePageComponents/FeedSection/FeedSection';
import RightBar from '../../../Components/HomePageComponents/RightBar/RightBar';

const Home = () => {
  const { isLaptop, isMobile } = useResponsiveType();
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState<string>('');
  const [postSelectedFile, setPostSelectedFile] = useState<File | null>(null);
  const { user, followingUsers, followersUsers, isLoading } = useSelector(
    (state: RootState) => state.UserReducer
  );
  const { CurrentComments, commentsLoading } = useSelector(
    (state: RootState) => state.CommentsReducer
  );
  const { TimelinePosts, isLoadingPosts } = useSelector(
    (state: RootState) => state.PostsReducer
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (user?._id) {
      dispatch(GetTimelinePosts(user._id));
      dispatch(GetFollowing(user._id));
      dispatch(GetFollowers(user._id));
    }
  }, [dispatch, user?._id]);

  const toggleCommentsSection = (postId: string) => {
    setActivePostId(activePostId === postId ? null : postId);

    // const activePost = TimelinePosts.find((post) => post._id === postId);
    // if (activePost) {
    //   dispatch(setComments(activePost.comments));
    // }
    dispatch(GetPostComments(postId));
  };

  useEffect(() => {
    console.log('Timeline Posts:');
    console.log(TimelinePosts);
  }, [TimelinePosts]);

  const handleLikePost = async (postId: string, post: any) => {
    console.log(post);
    const likedata = {
      userId: user?._id,
      postId
    };
    await dispatch(LikePost(likedata));
    await dispatch(GetTimelinePosts(user?._id));
  };

  const postFileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePostFileClick = () => {
    if (postFileInputRef.current) {
      postFileInputRef.current.click();
    }
  };

  const handleInputComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(e.target.value);
  };

  const handleUploadPostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  const ShareNewPostButton = async () => {
    const postData = new FormData();
    if (user) {
      postData.append('userId', user?._id);
    }
    if (postSelectedFile) {
      postData.append('postImage', postSelectedFile);
    }
    postData.append('postDescription', postContent);
    // const postData = {
    //   userId: user?._id,
    //   postDescription: postContent
    // };
    if (postContent !== '') {
      await dispatch(CreatePost(postData));
      await dispatch(GetTimelinePosts(user?._id));
      setPostContent('');
    } else {
      toast.error('Post content is empty');
    }
  };

  const handlePostFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostSelectedFile(file);
    }
  };

  const AddPostComment = async () => {
    if (!commentContent.trim() || !activePostId) return; // Do not submit if comment is empty

    // Create the comment object
    const commentData = {
      userId: user?._id,
      postId: activePostId,
      commentDescription: commentContent
    };

    try {
      // Dispatch an action to add the comment (assuming you have a Redux action or API function for this)
      await dispatch(CreatePostComment(commentData));
      await dispatch(GetTimelinePosts(user?._id));
      await dispatch(GetPostComments(activePostId));

      // Clear the input field and close the comments section
      setCommentContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="HomePageContainer">
      {!isMobile && <SideNav />}
      <FeedSection />

      {!isLaptop && <RightBar />}
    </div>
  );
};

export default Home;
