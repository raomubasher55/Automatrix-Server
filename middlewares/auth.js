
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

// check if user is authenticated or not
exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        console.log("Token not found in cookies");
        return next(new ErrorHandler('Login first to access this resource.', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        console.log("Token verification failed:", error.message);
        return next(new ErrorHandler('Invalid or expired token.', 401));
    }
};

//  handling user roles
exports.authorizeRoles = (...roles)=>{
   return (req,res,next)=>{
       if(!roles.includes(req.user.role)){
           return next(new ErrorHandler(`Role (${req.user.role}) is not allowes to acces the source `,403));
       }
       next()
   } 
}


