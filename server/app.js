const express=require('express')
const app=express();
const cookieParser=require('cookie-parser');
const bodyparser=require('body-parser');
const cloudinary=require('cloudinary');
const fileUpload=require('express-fileupload');

require('dotenv').config()
app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(fileUpload())
    





//Handle uncaught exceptions 
process.on('uncaughtException', err=>{
    console.log(`ERROR:${err.message}}`);
    console.log('shutting down due to uncaught exception');
    process.exit(1)
  
})
require('./config/database')    


//import all routes
app.use('/api/v1',require('./routes/product'))
app.use('/api/v1',require('./routes/user'))
app.use('/api/v1',require('./routes/payment'))
app.use('/api/v1',require('./routes/order'))




//middlewares
app.use(require('./middlewares/error'))

//setting up cloudinary configuration
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


//starting the server
const server=app.listen(process.env.PORT,()=>{
    console.log(`server running at port ${process.env.PORT} in ${process.env.NODE_MODE} mode.`)
})


//Handle unhandled promise rejection
process.on('unhandledRejection',err=>{
    console.log(`ERROR:${err.message}}`);
    console.log('shutting down server due to unhandled promise rejection');
    server.close(()=>{
        process.exit(1)
    });
})
