const express = require("express");
const multer = require('multer');
const path = require('path');
const {
  createUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();



router.route("/register").post(createUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);



module.exports = router;
