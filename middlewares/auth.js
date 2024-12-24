const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// Middleware to check if the user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    let token;

    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        // Extract token from cookies as a fallback
        token = req.cookies.token;
    }

    // If no token found
    if (!token) {
        return next(new ErrorHandler("Login first to access this resource.", 401));
    }

    try {
        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);

        // If user no longer exists
        if (!req.user) {
            return next(new ErrorHandler("User does not exist. Login again.", 401));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token.", 401));
    }
});

// Middleware to handle user roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not authorized to access this resource.`, 403));
        }
        next();
    };
};

