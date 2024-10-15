const {
  CreateMessage,
  GetConversationMessages
} = require('../controllers/MessageController');

const router = require('express').Router();

router.post('/', CreateMessage);
router.get('/:conversationId', GetConversationMessages);

module.exports = router;
