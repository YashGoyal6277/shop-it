//create and send token and save in cookie
module.exports=sendToken =async(user,statusCode,res)=>{
 //create JWT Token and save in cookie
 const token=await user.getJwtToken();
 const options={
     expires: new Date(Date.now()+process.env.COOKIE_EXPIRES_TIME*24*60*60*1000),
     httpOnly: true
 }
 res.status(statusCode).cookie('token',token,options).json({
     success: true,
     token,
     user
     
 })
}