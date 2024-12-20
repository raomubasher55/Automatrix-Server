const ErrorHandler = require('../utils/errorHandler');
const dotenv = require('dotenv');

dotenv.config({path: '../config/config.env'});

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    
    // Development environment 
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        return res.status(err.statusCode).json({
            success: false, 
            error: err,
            message: err.message,
            stack: err.stack
        });
    }

    // Production environment 
    if (process.env.NODE_ENV === "PRODUCTION") {
        let error = { ...err };

        // Ensure that message is preserved correctly
        error.message = err.message;

        // Return a simplified error message in production
        return res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }



    // WRONG mongoose object id errorHandler
    if(err.name === "CastError"){
        const message = `resource not found. Invalid : ${err.path}`
        error = new ErrorHandler(message,400)
    }

    // handling   mongoose validation error
    if(err.name == "ValidationError"){
        const message = Object.values(err.errors).map(value => value.message)
        error = new ErrorHandler(message,400)
    }

};
