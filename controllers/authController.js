const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/User");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const fs = require('fs');
const { userValidationRules } = require("../helpers/userValidator");
const { validate } = require("../middlewares/validationMiddleware");

// register a new user  => /api/v1/register

exports.createUser = [
  ...userValidationRules(),
  validate,
  catchAsyncErrors(async (req, res) => {
    const user = await User.create(req.body);
    sendToken(user, 200, res); 
  })
];


exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // check if password and email enetred by user
  if (!email && !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("INVALID EMAIL or password ", 401));
  }

  // check if password is correct or notr
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("INVALID EMAIL or password ", 401));
  }

  sendToken(user, 200, res);
});

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // If you're in production, set secure cookie.
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});


exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // 1. Find the user by email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // 2. Get the reset token
  const resetToken = user.getResetPasswordToken();

  // 3. Save the token and expiration to the database
  await user.save({ validateBeforeSave: false });

  // 4. Create the reset password URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore it.`;

  // 5. Try sending the email
  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    // If email fails, reset token fields and save
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

// resetPasswordToken password  => api/v1/password/reset/:token

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // hash url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("INVALID not found or token is expired ", 400)
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("password not matches  ", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res);
});

 