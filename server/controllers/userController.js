const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const sendToken=require('../utils/jwtToken')
const sendEmail=require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary=require('cloudinary')

//Register a user=>/api/v1/register
exports.registerUser=catchAsyncError(async(req,res,next)=>{
     
     const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
         width: 150,
         crop: "scale"
     })
     const {name,email,password} = req.body;
   console.log(name, email, password)
    const user=await User.create({name:name,email:email,password:password,
        avatar: {
            public_id:result.public_id,
            url: result.secure_url,
        }
        
        })
       
     sendToken(user,200,res);
})
//Get currently loggedin user details  => api/v1/me
exports.getUserProfile =catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

// update or change password -> /api/v1/password/update
exports.updatePassword= catchAsyncError(async(req, res, next)=>{
    const user=await User.findById(req.user.id).select('+password');
    const isMatched=await user.comparePassword(req.body.oldpassword);
    if(!isMatched){
        return next(new ErrorHandler('Old password mismatch',400))
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user,200,res)
    
       
})

//update user profile -> /api/v1/me/update
exports.updateProfile=catchAsyncError(async (req, res, next) => {
    const newUserData={name:req.body.name,email:req.body.email}
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:true
    })
    res.status(200).json({
        success: true
    })
})


//Login User=> api/v1/login
module.exports.loginUser=catchAsyncError(async (req, res, next)=>{
    const {email,password} = req.body;
    //checks if name and pass are valid;
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password',400));
    }
    const user=await User.findOne({email:email}).select('+password') // +password => as we have wriiten select=false in password in usermodel
    if(!user)
    return next(new ErrorHandler('Invalid Email or Password',401));
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch) return next(new ErrorHandler('Invalid Email or Password',401));
    
       sendToken(user,200,res)
    
})

//Logout User=> api/v1/logout
module.exports.logoutUser=catchAsyncError(async(req,res,next) => {
    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({success:true,message:"You are successfully Logged out..."})
})


//ADMIN ROUTES
   // Get all user details -> /api/v1/admin/users
exports.allUsers = catchAsyncError(async (req, res, next) => {
    const user = await User.find();
    res.status(200).json({
        success: true,
        user
    })
})

   // Get particular user details -> /api/v1/admin/user/:id
   exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new Error('User not found',400))
    }
    res.status(200).json({
        success: true,
        user
    })
})

//admin can update user details like email,role,name -> /api/v1/admin/update/:id
exports.updateUser=catchAsyncError(async (req, res, next) => {
    const newUserData={name:req.body.name,email:req.body.email,role:req.body.role}
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:true
    })
    res.status(200).json({
        success: true
    })
})
//admin can delete user-> /api/v1/admin/delete/:id
exports.deleteUser=catchAsyncError(async (req, res, next) => {
 
    const user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler('User not found',404));
    }
    await user.remove();
    res.status(200).json({
        success: true
    })
})


//forgot password -> api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = await user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        console.log("this is token",user.resetPasswordToken)
        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))
    }

})

//reset password -> api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {

    // Hash URL token
    console.log(req.params.token)
    const getToken=req.params.token;
    // const resetPasswordToken = await crypto.createHash('sha256').update(req.params.token).digest('hex')
    //  console.log(resetPasswordToken);
    const user = await User.findOne({
        resetPasswordToken: getToken,
        resetPasswordExpire: { $gt: Date.now() }
        
    })
     console.log(user.resetPasswordToken)

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
     await user.save();
    sendToken(user, 200, res)

})
