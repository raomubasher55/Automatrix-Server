const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');

// Get all users (accessible to superadmin)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Get user by ID
exports.getUserById = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// Update a user's role (admin, superadmin, or user)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { userId, role } = req.params;

  // Check if the role provided is valid
  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) {
    return next(new ErrorHandler('Invalid role provided', 400));
  }

  // Find the user and update their role
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (userId.toString() === req.user._id.toString() && req.user.role === 'admin') {
    return next(new ErrorHandler('Admin cannot change their own role', 400));
  }

  user.role = role;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user: {
      id: user._id,
      role: user.role,
    },
  });
});

// Delete a user (accessible to superadmin)
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  // Ensure superadmin cannot delete their own account
  if (req.params.userId.toString() === req.user.id.toString() && req.user.role === 'admin') {
    return next(new ErrorHandler('Admin cannot delete their own account', 400));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});


