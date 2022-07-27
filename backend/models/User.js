const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:[true,"plz enter a name"]
},
avatar:{
    pubilc_id:String,
    Url:String,
},
email:{
    type:String,
    required:[true,"plz enter a mail"],
    unique:[true,"email already exists"]
},
password:{
    type:String,
    required:[true,"plz enter a password"],
    minlength:[6,"password must be atleast 6 characters"]

},
posts :[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
}],
followers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
],
following:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
],


})
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
    }
    next()
})
userSchema.methods.matchPassword=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateToken=function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET)
}
module.exports=mongoose.model("User", userSchema);