const mongoose=require('mongoose')
const postSchema=new mongoose.Schema({
caption:String,
image:{
    pubilc_id:String,
    Url:String,
},
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
},
createAt:{
    type:Date,
    default:Date.now
},
likes:[
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
        },
    },
],
comments:[
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user",
        },
        comment:{
            type:String,
            required:true,
        },
    },
],


})
module.exports=mongoose.model("Post",postSchema);