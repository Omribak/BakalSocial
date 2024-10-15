const {
  CreateConversation,
  GetConversations
} = require('../controllers/ConversationController');

const router = require('express').Router();

router.post('/', CreateConversation);
router.get('/:userId', GetConversations);

module.exports = router;
