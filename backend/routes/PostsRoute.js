const {
  CreatePost,
  UpdatePost,
  DeletePost,
  LikePost,
  GetPost,
  GetTimelinePosts
} = require('../controllers/PostController');
const { upload } = require('../utils/fileUpload');

const router = require('express').Router();

router.post('/', upload.single('postImage'), CreatePost);
router.put('/:id', UpdatePost);
router.put('/:id/like', LikePost);
router.get('/:id', GetPost);
router.get('/:userId/timeline/all', GetTimelinePosts);
router.delete('/:id', DeletePost);

module.exports = router;
