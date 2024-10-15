const {
  CreateComment,
  GetPostComments
} = require('../controllers/CommentController');

const router = require('express').Router();

router.post('/', CreateComment);
router.get('/:postId', GetPostComments);

module.exports = router;
