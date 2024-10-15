const mongoose = require('mongoose');

const CommentScehma = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    postId: {
      type: String,
      required: true
    },
    commentDescription: {
      type: String,
      max: 50
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentScehma);
