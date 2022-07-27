const { json } = require("express");
const User=require("../models/User")
exports.register=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        let user=await User.findOne({email});
        if(user){
         return res
         .status(400)
         .json({success:false,message:"user already exists"})
        }
        user=await User.create({
            name,
            email,
            password,
            avatar:{public_id:"sample_id",url:"sample_url"},
    })
    res.status(200).json({success:true,user})
    }catch(error){
        res.status(200).json({
            success:false,
            message:error.message,
        })
    }
}
exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body
        //console.log(email,password)
        const user=await User.findOne({email})
        if(!user){
            return res
            .status(400)
            .json({success:false,message:"user does not exist"})
        }
        const isMatch=await user.matchPassword(password)
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect Password"
            })
        }
        const token=await user.generateToken();
        const options={
            expires:new Date(Date.now()+90*24*60*60*1000),
            httpOnly:true,
        }
        res.status(201).cookie("token",token,options).json({
            success:true,
            user,
            token,
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}
exports.logout=async(req,res)=>{
    try{
        res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({
            success:true,
            message:"Log Out"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
    
exports.followUser=async(req,res)=>{
    try{
        const userToFollow=await User.findById(req.params.id)
        const loggedInUser=await User.findById(req.user._id)
        if(!userToFollow){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        if(loggedInUser.following.includes(userToFollow._id)){
            const indexfollowing=loggedInUser.following.indexOf(userToFollow._id)
            loggedInUser.following.splice(indexfollowing,1)

            const indexfollowers=userToFollow.followers.indexOf(userToFollow._id)
            userToFollow.followers.splice(indexfollowers,1)

            await loggedInUser.save()
            await userToFollow.save()

            res.status(500).json({
                success:true,
                message:"User Unfollowed "
            })
        }
        else{
        loggedInUser.following.push(userToFollow._id)//add following
        userToFollow.followers.push(loggedInUser._id)//we are add in user followers

        await loggedInUser.save()
        await userToFollow.save()
        res.status(200).json({
            success:false,
            message:"User followed"
        })
    }
}catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
exports.updatePassword=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id)
        const {oldPassword,newPassword}=req.body
        if(!oldPassword|| !newPassword){
            return res.status(400).json({
                success:false,
                message:"plz provide old and new password"
            })
        }
        const isMatch=await user.matchPassword(oldPassword)
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect old Password"
            })
        }
        user.password=newPassword;
        await user.save()
        res.status(200).json({
            success:true,
            message:"Password update",
        })

    }catch(error){
        res.status(500).json({
        success:false,
        message:error.message
        })
    }
}
exports.updateProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.user._id)
        const {name,email}=req.body;
        if(name){
            user.name=name
        }
        if(email){
            user.email=email
        }
        await user.save()
        res.status(200).json({
            success:true,
            message:"Profile Updated"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}