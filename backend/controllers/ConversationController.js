const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');

// New Conversation

exports.CreateConversation = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId]
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json({
      status: 'success',
      savedConversation
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Conversations

exports.GetConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] }
    });
    res.status(200).json({
      status: 'success',
      conversations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
