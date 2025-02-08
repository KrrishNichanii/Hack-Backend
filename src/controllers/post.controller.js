import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


//tested
const createPost = async (req, res) => {
  try {
    const { title, content, tags, userId } = req.body;
    if (!title || !content) {
      throw new Error("All fields are required");
    }

    // Check if media is provided
    if (!req.file) {
      throw new Error('Media is required');
    }

    // Upload media to Cloudinary
    const mediaLocalPath = req?.file?.path;
    const media = await uploadOnCloudinary(mediaLocalPath);
    
    if (!media) {
      throw new Error('Unable to upload media');
    }

    // Create the post with media
    const post = await Post.create({
      title,
      content,
      media: {
        public_id: media.public_id,
        secure_url: media.secure_url,
      },
      tags: tags,
      user: userId,
      comments: []
    });

    // Fetch the newly created post and send response
    const populatedPost = await Post.findById(post._id);
    return res.status(200).send({
      success: true,
      message: "Successfully added post",
      data: populatedPost
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
      data: {}
    });
  }
};

//tested
const likePost = async  (req, res) => {
    try { 
        const { postId } = req.body ; 
        console.log('Post id ',req.body);
        
        if(!postId){
          throw new Error("Post ID is required") ;  
        }

        // Like Post
        let post = await Post.findById(postId) ; 
        if(!post){
          throw new Error("Post not found") ; 
        }

        post.likes += 1 ; 
        await post.save() ;
        post = await Post.findById(postId) ; 
        res.status(200).send({success: true , message: "Post liked successfully" , data: post}) ; 
    } catch (error) {
        res.send({success: false , message: error.message , data: {}}) ; 
    }
}

//tested
const deletePost = async (req, res)=>{
    try {
        const { postId } = req.body ; 
        if(!postId){
          throw new Error("Post ID is required") ; 
        }
        // Delete Post
        const post = await Post.findByIdAndDelete(postId) ; 
        res.send({success: true ,message: "Post deleted successfully" , data:post}) ; 
    } catch (error) {
        res.send({success: false , message: error.message , data: {}}) ; 
    }
};


//tested
const getAllPosts = async(req , res) => {
  try {
    const posts = await Post.find({}) ; 
    return res.status(200).json({success: true , message: "Posts fetched successfully" , data: posts}) ; 
  } catch (error) {
    return res.status(400).json({success: false , message: error.message , data: {}}) ; 
  }
}



//tested
const getPostsByUserId = async(req , res) => {
  try {
    const { userId } = req.params ; 
    // console.log('UserId ' , req.query);
    if(!userId) throw new Error("User ID is required") ; 
    
    const posts = await Post.find({user: userId}) ; 
    return res.status(200).json({success: true , message: "Posts fetched successfully" , data: posts}) ; 
  } catch (error) {
    return res.status(400).json({success: false , message: error.message , data: {}}) ; 
  }
}

export { createPost, deletePost, likePost , getAllPosts , getPostsByUserId};


