const mongoose = require('mongoose');

const PostScehma = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    postDescription: {
      type: String,
      max: 500
    },
    postImage: {
      type: String
    },
    likes: {
      type: Array,
      default: []
    },
    NumComments: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostScehma);
