import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../Redux/store';
import { Input } from '@mui/material';
import { AddPostItems } from '../../../Pages/AppPages/HomePage/data-structures';
import { BlueButton, GreenButton } from '../../../GlobalStyles/globalStyles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  CreatePost,
  GetTimelinePosts,
  LikePost
} from '../../../Redux/Posts/PostsSlice';
import { toast } from 'react-toastify';
import { format } from 'timeago.js';
import { ChatOutlined, FavoriteBorderOutlined } from '@mui/icons-material';
import {
  CreatePostComment,
  GetPostComments
} from '../../../Redux/Comments/CommentsSlice';
import { SyncLoader } from 'react-spinners';
import '../../../Pages/AppPages/HomePage/HomePage.css';

const FeedSection = () => {
  const { user } = useSelector((state: RootState) => state.UserReducer);
  const [postContent, setPostContent] = useState('');
  const [postSelectedFile, setPostSelectedFile] = useState<File | null>(null);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState<string>('');
  const { CurrentComments, commentsLoading } = useSelector(
    (state: RootState) => state.CommentsReducer
  );
  const dispatch = useDispatch<AppDispatch>();
  const { TimelinePosts, isLoadingPosts } = useSelector(
    (state: RootState) => state.PostsReducer
  );

  const postFileInputRef = useRef<HTMLInputElement | null>(null);
  const handlePostFileClick = () => {
    if (postFileInputRef.current) {
      postFileInputRef.current.click();
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

  const handleLikePost = async (postId: string, post: any) => {
    console.log(post);
    const likedata = {
      userId: user?._id,
      postId
    };
    await dispatch(LikePost(likedata));
    await dispatch(GetTimelinePosts(user?._id));
  };

  const handleInputComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentContent(e.target.value);
  };

  const toggleCommentsSection = (postId: string) => {
    setActivePostId(activePostId === postId ? null : postId);

    // const activePost = TimelinePosts.find((post) => post._id === postId);
    // if (activePost) {
    //   dispatch(setComments(activePost.comments));
    // }
    dispatch(GetPostComments(postId));
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

  const handleUploadPostInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostContent(e.target.value);
  };

  return (
    <div className="FeedSectionWrapper">
      <div className="UploadPostWrapper">
        <div className="UploadPostHeader">
          <img
            className="UserProfileImage"
            src={user?.profilePicture}
            alt="Profile"
          />
          <p>What's on your mind {user?.username}?</p>
        </div>
        <Input
          className="UploadPostInput"
          onChange={handleUploadPostInput}
          value={postContent}
        />
        <div className="PostOptions">
          {AddPostItems.map((item) => (
            <div className="PostOption" key={item.label}>
              <input
                type="file"
                name="postImage"
                id="upload-postFile"
                accept="image/*"
                className="UploadFileInput"
                ref={postFileInputRef}
                onChange={handlePostFileChange}
              />
              <label htmlFor="upload-postFile">
                <button
                  onClick={handlePostFileClick}
                  className="UploadPostImageBtn"
                >
                  <img className="UploadPostIcon" src={item.icon} alt="none" />
                  {item.label}
                </button>
              </label>
            </div>
          ))}
          <GreenButton onClick={ShareNewPostButton}>Share</GreenButton>
        </div>
      </div>

      <div className="FeedPostsWrapper">
        {TimelinePosts.length === 0 && !isLoadingPosts && (
          <p>
            Looks like there are no posts yet. Start following some friends or
            create your own!
          </p>
        )}
        {TimelinePosts.map((post) => (
          <div className="PostWrapper" key={post._id}>
            <div className="PostImageContent">
              <div className="PostTitle">
                <img
                  className="UserProfileImage"
                  src={post.user.profilePicture}
                  alt="Profile"
                />
                <p className="PostUsername">{post.user.username}</p>
                <p className="PostTime">{format(post.createdAt)}</p>
              </div>
              <p>{post.postDescription}</p>
              {post.postImage && (
                <img
                  src={post.postImage}
                  alt="Post"
                  className="HomePostImage"
                />
              )}
            </div>
            <div className="LikeAndCommentsSection">
              <button
                className="NumLikes"
                onClick={() => handleLikePost(post._id, post)}
              >
                {post.likes.includes(user?._id) ? (
                  <FavoriteIcon className="UserLikedIcon" />
                ) : (
                  <FavoriteBorderOutlined />
                )}
                {post.likes.length} Likes
              </button>
              <button
                className="NumComments"
                onClick={() => toggleCommentsSection(post._id)}
              >
                <ChatOutlined />
                {post.NumComments} comments
              </button>
            </div>

            {activePostId === post._id && (
              <div className="CommentsSection">
                <div className="WriteCommentSection">
                  <img
                    className="UserProfileImage"
                    src={user?.profilePicture}
                    alt="Profile"
                  />
                  <input
                    className="WriteCommentInput"
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={handleInputComment}
                  />
                  <BlueButton onClick={AddPostComment}>Send</BlueButton>
                </div>
                <div className="UserPostsWrapper">
                  {commentsLoading ? (
                    <SyncLoader color="#8fbbf3" />
                  ) : (
                    CurrentComments.map((userpost: any) => (
                      <div className="UserPost" key={userpost.post_username}>
                        <img
                          className="UserProfileImage"
                          src={userpost.user.profilePicture}
                          alt="Profile"
                        />
                        <div className="PostContent">
                          <p className="PostUsernameText">
                            {userpost.user.username}
                          </p>
                          <p>{userpost.commentDescription}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedSection;
