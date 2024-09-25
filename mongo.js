const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/LOGINPAGE")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log('failed');
})

const logInSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const LogInCollection=new mongoose.model('LOGIN',logInSchema)

module.exports=LogInCollection