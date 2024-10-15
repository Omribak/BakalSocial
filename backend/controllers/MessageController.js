const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');

// New Conversation
exports.CreateMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();

    const user = await User.findById(savedMessage.sender);

    res.status(200).json({
      status: 'success',
      newMessage: {
        ...savedMessage._doc, // Spread the saved message details
        user: {
          // Add the user info
          _id: user._id,
          username: user.username,
          profilePicture: user.profilePicture
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Conversations

exports.GetConversationMessages = async (req, res) => {
  try {
    const conversationMsgsNoUser = await Message.find({
      conversationId: req.params.conversationId
    });
    const conversationMsgs = await Promise.all(
      conversationMsgsNoUser.map(async (msg) => {
        const user = await User.findById(msg.sender);
        return {
          ...msg._doc,
          profilePicture: user.profilePicture,
          user: {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture
          }
        };
      })
    );
    res.status(200).json({
      status: 'success',
      conversationMsgs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
