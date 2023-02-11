const ErrorHandler = require('../utils/errorHandler');
module.exports=(err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
     if(process.env.NODE_MODE==='DEVELOPMENT'){
        res.status(err.statusCode).json({
            success: false,
            error:err,
            errMessage: err.message,
            stack:err.stack
        });
        
     }
     if(process.env.NODE_MODE==='PRODUCTION'){
        let error={...err}
        
        error.message=err.message;
        //wrong Mongoose Object Id Error
        if(err.name==='CastError'){
            const message=`Resource not found.Invalid:${err.path}`
            error=new ErrorHandler(message, 400)
        }
        //handling Mongoose Validation Error
        if(err.name==='ValidationError'){
            //object.values convert object into array
            const message=Object.values(err.errors).map(values=>values.message);
            error=new ErrorHandler(message,400)
        }
        //Handling Mongoose duplicate key errors
        if(err.code===11000){
            const message=`${Object.keys(err.keyValue)} already exists.`;
            error=new ErrorHandler(message,400)
        }
        //handling wrong JWT error
        if(err.name==="JsonWebTokenError"){
            const message='JSON Web Token is not valid.Please try again';

            error=new ErrorHandler(message,400)
        }
        //handling expire JWT error
        if(err.name==="TokenExpiredError"){
            const message='JSON Web Token is expired.Please try again';

            error=new ErrorHandler(message,400)
        }
        
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
     }
    
}