const express=require('express');
const { createPost, likeAndUnlikePost} = require('../controllers/post');
const {deletePost}=require('../controllers/post')
const{getPostofFollowing}=require('../controllers/post')
const{updateCaption}=require('../controllers/post')
const{commentOnPost}=require('../controllers/post')
const{deleteComment}=require('../controllers/post')
const { isAuthenticated } = require('../middlewares/auth');
const router=express.Router();
router.route("/post/upload").post(isAuthenticated ,createPost)
router.route("/post/:id").get(isAuthenticated,likeAndUnlikePost)
router.route("/post/:id").delete(isAuthenticated,deletePost)
router.route("/posts").get(isAuthenticated,getPostofFollowing)
router.route("/post/:id").put(isAuthenticated,updateCaption)
router.route("/post/comment/:id").put(isAuthenticated,commentOnPost)
router.route("/post/comment/:id").put(isAuthenticated,deleteComment)
module.exports=router