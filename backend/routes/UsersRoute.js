const {
  Register,
  Login,
  UpdateUser,
  DeleteUser,
  GetUser,
  FollowUser,
  UnfollowUser,
  Logout,
  authMiddleware,
  GetFollowing,
  GetFollowers,
  UpdateUserPassword,
  ForgotPassword,
  ResetPassword,
  SearchFriends
} = require('../controllers/UserController');
const { upload } = require('../utils/fileUpload');

require('dotenv').config();


const router = require('express').Router();

router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/forgot-password', ForgotPassword);
router.post('/reset-password/:token', ResetPassword);
router.put('/unfollow/:id', UnfollowUser);
router.put('/follow/:id', FollowUser);
router.put('/:id', upload.single('profilePic'), UpdateUser);
router.put('/:id/change-password', UpdateUserPassword);
router.delete('/:id', DeleteUser);
router.get('/search-friends/:searchField', SearchFriends);
router.get('/check-auth', authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    status: 'success',
    message: 'User is authenticated.',
    user
  });
});
router.get('/:id', GetUser);
router.get('/:id/all-following', GetFollowing);
router.get('/:id/all-followers', GetFollowers);
module.exports = router;
