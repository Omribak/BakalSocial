const mongoose = require('mongoose');

const UserScehma = new mongoose.Schema(
  {
    username: {
      type: String,
      min: 3,
      max: 20,
      required: true
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true
    },
    password: {
      type: String,
      min: 6,
      required: true
    },
    profilePicture: {
      type: String,
      default:
        'https://bakalsocial-bucket.s3.il-central-1.amazonaws.com/app-images/default-user-profile.png'
    },
    coverPicture: {
      type: String,
      default: ''
    },
    followers: {
      type: Array,
      default: []
    },
    following: {
      type: Array,
      default: []
    },
    description: {
      type: String,
      max: 50
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3]
    },
    country: {
      type: String,
      max: 20,
      default: ''
    },
    city: {
      type: String,
      max: 20,
      default: ''
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserScehma);
