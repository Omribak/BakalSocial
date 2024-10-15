const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
//Create a Post

exports.CreatePost = async (req, res) => {
  if (req.file) {
    req.body.postImage = req.file.location;
  }
  const NewPost = new Post(req.body);
  try {
    const savedPost = await NewPost.save();
    res.status(200).json({
      status: 'success',
      message: 'Post created',
      savedPost
    });
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};

//Update a Post

exports.UpdatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({
        status: 'success',
        message: 'Post has been edited'
      });
    } else {
      res.status(403).json({
        status: 'error',
        message: 'You can only edit your own posts'
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Delete a Post

exports.DeletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Post deleted successfully'
      });
    } else {
      res.status(403).json({
        status: 'error',
        message: "You can't delete other users posts"
      });
    }
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};

//Like a Post

exports.LikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({
        status: 'success',
        message: 'Post has been liked'
      });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({
        status: 'success',
        message: 'The Post has been disliked',
        postId
      });
    }
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};

//Get a Post

exports.GetPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: "Post wasn't found"
      });
    } else {
      res.status(200).json({
        status: 'success',
        post
      });
    }
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};

//Get Timeline Posts

exports.GetTimelinePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    if (!currentUser) {
      return res
        .status(404)
        .json({ status: 'error', message: 'User not found' });
    }

    // Fetch all posts by the current user
    const UserPosts = await Post.find({ userId: req.params.userId }).sort({
      createdAt: -1
    });

    // Fetch all friends' posts
    const FriendsPosts = await Promise.all(
      currentUser.following.map(async (friendId) => {
        return await Post.find({ userId: friendId });
      })
    );

    // Flatten the array of arrays and combine with UserPosts
    const PostArray = UserPosts.concat(...FriendsPosts);

    // Sort the combined posts by createdAt date
    const sortedPosts = PostArray.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Fetch user details and comments for each post
    const postsWithDetails = await Promise.all(
      sortedPosts.map(async (post) => {
        const postUser = await User.findById(post.userId);
        const comments = await Comment.find({ postId: post._id });

        const commentsWithUserDetails = await Promise.all(
          comments.map(async (comment) => {
            const commentUser = await User.findById(comment.userId);
            return {
              id: comment._id,
              userId: comment.userId,
              commentDescription: comment.commentDescription,
              createdAt: comment.createdAt,
              user: {
                id: commentUser._id,
                username: commentUser.username,
                profilePicture: commentUser.profilePicture
              }
            };
          })
        );

        return {
          ...post.toObject(),
          user: {
            id: postUser._id,
            username: postUser.username,
            profilePicture: postUser.profilePicture
          },
          comments: commentsWithUserDetails
        };
      })
    );

    res.status(200).json({
      status: 'success',
      PostArray: postsWithDetails
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
