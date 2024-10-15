const mongoose = require('mongoose');

const ConversationScehma = new mongoose.Schema(
  {
    members: {
      type: Array
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationScehma);
