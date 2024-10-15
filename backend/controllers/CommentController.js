const Comment = require('../models/Comment');
const Post = require('../models/Post'); // Import the Post model
const User = require('../models/User');
const mongoose = require('mongoose');

exports.CreateComment = async (req, res) => {
  try {
    const { userId, postId, commentDescription } = req.body;

    // Create and save the new comment
    const savedComment = new Comment({
      userId,
      postId,
      commentDescription,
      createdAt: new Date()
    });
    await savedComment.save();

    // Increment the Comments count in the Post model
    await Post.findByIdAndUpdate(
      postId,
      { $inc: { NumComments: 1 } }, // Increment the Comments count by 1
      { new: true } // Return the updated document
    );

    // Respond with the saved comment
    res.status(201).json({
      status: 'success',
      message: 'New Comment Created.',
      savedComment
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
};
exports.GetPostComments = async (req, res) => {
  try {
    const postId = req.params.postId; // Extract postId from URL parameter

    // Fetch comments related to the specific postId
    const comments = await Comment.find({ postId });

    if (comments.length === 0) {
      return res.status(200).json({ status: 'success', comments: [] });
    }

    // Extract userIds from comments
    const userIds = [...new Set(comments.map((comment) => comment.userId))];

    // Fetch user details for the extracted userIds
    const users = await User.find({ _id: { $in: userIds } });

    // Create a map of user details for quick lookup
    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});

    // Attach user details to each comment
    const commentsWithUserDetails = comments.map((comment) => ({
      ...comment._doc, // Include all comment fields
      user: userMap[comment.userId] || {} // Add user details
    }));

    // Send response with comments and user details
    res.status(200).json({
      status: 'success',
      comments: commentsWithUserDetails
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
