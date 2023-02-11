const mongoose=require('mongoose')
const MONGOURI=process.env.DB_URI
mongoose.connect(MONGOURI)
mongoose.connection.on('connected',async()=>{
    try{
      console.log("connection successful")    
    }
    catch(err){
        console.log(err)
    }
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})