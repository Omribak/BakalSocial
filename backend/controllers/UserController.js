const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  sendPasswordResetToken,
  sendPasswordResetEmail,
  sendResetSuccessEmail
} = require('../mailtrap/utils');

//Register

exports.Register = async (req, res) => {
  try {
    if (await User.findOne({ email: req.body.email })) {
      return res.status(403).json({
        status: 'error',
        message:
          'User already exists with the same email , please choose another email.'
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      city: req.body.city,
      country: req.body.country
    });

    const user = await newUser.save();
    res.status(200).json({
      status: 'success',
      message: 'User Created.',
      user
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//Login

exports.Login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: "User doesn't exists"
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is incorrect'
      });
    }

    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        id: user.id,
        following: user.following,
        followers: user.followers,
        country: user.country,
        city: user.city
      },
      process.env.JWT_SECRET,
      { expiresIn: '60mins' }
    );

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })
      .status(200)
      .json({
        status: 'success',
        message: 'Login successful',
        user
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

//LOGOUT

exports.Logout = async (req, res) => {
  res.clearCookie('token').status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

//CHECK AUTH

// exports.authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json({
//       status: 'error',
//       message: 'Unauthorized User'
//     });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({
//       status: 'error',
//       message: 'Unauthorized User'
//     });
//   }
// };

exports.authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; // Assuming the token is stored in cookies
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized User'
    });
  }

  try {
    // Verify the token and get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Assuming 'id' is stored in the token

    // Fetch the user from the database
    const user = await User.findById(userId);

    // If the user is not found or inactive, return an error
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found or unauthorized'
      });
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(401).json({
      status: 'error',
      message: 'Unauthorized User'
    });
  }
};

//FORGOT PASSWORD

exports.ForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User is not found'
      });
    }
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    await sendPasswordResetEmail(
      user.email,
      `${process.env.DEV_URL}/reset-token/${resetToken}`
    );
    res.status(200).json({
      status: 'success',
      message: 'Password reset link was sent to your email.'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

//RESET PASSWORD

exports.ResetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  if (password != confirmPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Passwords dont match'
    });
  }
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid token or expired reset token'
      });
    }
    //update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      err
    });
  }
};

//UPDATE USER

exports.UpdateUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json({
          error: error.message
        });
      }
    }

    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User is not found'
        });
      }

      if (req.file) {
        req.body.profilePicture = req.file.location;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      const newToken = jwt.sign(
        {
          username: updatedUser.username,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture,
          id: updatedUser.id,
          following: updatedUser.following,
          followers: updatedUser.followers,
          country: updatedUser.country,
          city: updatedUser.city
        },
        process.env.JWT_SECRET,
        { expiresIn: '60mins' }
      );

      // Send the new token back to the client
      res
        .cookie('token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        })
        .status(200)
        .json({
          status: 'success',
          message: 'User updated successfully',
          updatedUser
        });
    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'You can update only your account'
    });
  }
};

exports.UpdateUserPassword = async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      if (req.body.password === req.body.confirmPassword) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (error) {
          return res.status(500).json({
            error
          });
        }
      }
    }
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User is not found'
        });
      }
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
      });
      res.status(200).json({
        status: 'success',
        message: 'User updated successfuly'
      });
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'You can update only your account'
    });
  }
};

//DELETE USER

exports.DeleteUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User is not found'
        });
      }
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'User deleted successfuly'
      });
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'You can delete only your account'
    });
  }
};

//GET A USER

exports.GetUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User is not found'
      });
    } else {
      const { __v, password, updatedAt, ...userData } = user._doc;
      res.status(200).json({
        status: 'success',
        userData
      });
    }
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};

//FOLLOW USER

exports.FollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const CurrentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await CurrentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json({
          status: 'success',
          message: 'User has been followed',
          FollowID: req.params.id
        });
      } else {
        return res.status(403).json({
          status: 'error',
          message: 'You already follow this user'
        });
      }
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  } else {
    return res.status(403).json({
      status: 'error',
      message: "You can't follow yourself"
    });
  }
};

//UNFOLLOW USER

exports.UnfollowUser = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const CurrentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await CurrentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({
          status: 'success',
          message: 'User has been unfollowed',
          FollowID: req.params.id
        });
      } else {
        return res.status(403).json({
          status: 'error',
          message: 'You dont follow this user'
        });
      }
    } catch (error) {
      return res.status(500).json({
        error
      });
    }
  } else {
    return res.status(403).json({
      status: 'error',
      message: "You can't unfollow yourself"
    });
  }
};

//GET FOLLOWING
exports.GetFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Map over the following IDs and fetch each user's details
    const AllFollowing = await Promise.all(
      user.following.map(async (friendId) => {
        // Fetch the user by ID and return the single document
        const friend = await User.findById(friendId);
        return friend; // Return the friend document directly
      })
    );

    res.status(200).json({
      status: 'success',
      AllFollowing
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.GetFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Map over the following IDs and fetch each user's details
    const AllFollowers = await Promise.all(
      user.followers.map(async (friendId) => {
        // Fetch the user by ID and return the single document
        const friend = await User.findById(friendId);
        return friend; // Return the friend document directly
      })
    );
    res.status(200).json({
      status: 'success',
      AllFollowers
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

exports.SearchFriends = async (req, res) => {
  try {
    const searchField = req.params.searchField;
    if (!searchField) {
      return res.status(400).json({
        status: 'error',
        message: 'Search is empty'
      });
    }
    const users = await User.find({
      username: { $regex: searchField, $options: 'i' }
    });
    res.status(200).json({
      status: 'success',
      results: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

//TEST ROUTE
// res.status(200).json({
//   status: 'Testing route'
// });
