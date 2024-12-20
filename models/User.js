const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config({ path: "./config.env" });

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^\S+@\S+\.\S+$/.test(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    validate: {
      validator: (v) => /^\+?[1-9]\d{1,14}$/.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  jobTitle: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user',
  },
  siteSurvey: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SiteSurvey', 
  }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.comparePassword = async function (enetredPassword) {
  return await bcrypt.compare(enetredPassword, this.password);
};

// genrate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Genrate Toekn
  const resetToken = crypto.randomBytes(20).toString("hex");
  // hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // set token expires time
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
