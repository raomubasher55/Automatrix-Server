const { body } = require("express-validator");
const User = require("../models/User");

// Validation rules for creating and updating a user
const userValidationRules = () => {
  return [
    body("firstName")
      .isString()
      .withMessage("First name must be a string")
      .notEmpty()
      .withMessage("First name is required"),

    body("lastName")
      .isString()
      .withMessage("Last name must be a string")
      .notEmpty()
      .withMessage("Last name is required"),

    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .notEmpty()
      .withMessage("Email is required")
      .custom(async (email) => {
        if (!email.endsWith("@automatrix.pk")) {
          throw new Error("Email must be from the @automatrix.pk domain");
        }
        
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Email already exists");
        }
        return true;
      }),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
      .notEmpty()
      .withMessage("Password is required"),

    body("phone") 
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
  ];
};

module.exports = { userValidationRules };
