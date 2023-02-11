const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:[true,'Please enter your name'],
    maxLength:[30,'Your name cannot exceed 30 characters']
},
email:{
    type:String,
    required:[true,'Please enter your email'],
    unique:true,
    validate:[validator.isEmail,'Please enter a valid email']
},
password:{
    type:String,
    required:[true,'Please enter your password'],
    minlength:[6,'Password must be at least 6 characters long'],
    select:false
},
avatar: {
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
},
role: {
    type:String,
    default:'user'
},
created_at: {
    type:Date,
    default:Date.now
},
resetPasswordToken:String,
resetPasswordExpire:Date 

})
//encrypting the password
userSchema.pre('save',async function(next){
    console.log('hi how are u//////')
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10)
 
    }
    next()
})
//compare the password
userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
//generating the token
userSchema.methods.getJwtToken=async function(){
        
        let generatedToken=jwt.sign({_id:this._id},process.env.SECRET_KEY,{
            expiresIn:process.env.JWT_EXPIRES_TIME
        });
        console.log(generatedToken)
        return generatedToken;
 }
//generated token for reset Password
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

     console.log('reset',resetToken);
     this.resetPasswordToken=resetToken;
    // Hash and set to resetPasswordToken
    //  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    //   console.log('hash',this.resetPasswordToken);
    //   console.log('hash',this.resetPasswordExpire);
    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken

}
 
const User=mongoose.model('User',userSchema)
module.exports =User;



