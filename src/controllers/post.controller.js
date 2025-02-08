import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = async (req, res) => {
  try {
    const { title, content ,tags, userId } = req.body;
    
    if (!title || !content) {
      throw new Error("All fields are required") ; 
    }

    const mediaLocalPath = req?.file?.path ;

    if(req.file){
          const media = await uploadOnCloudinary(mediaLocalPath) ; 
          let post = await Post.create({
            title,
            content,
            media :{
                public_id: "" , 
                secure_url:"" ,
            } , 
            tags,
            user: userId,
          });

         if(media){
          post.media.public_id = media.public_id ; 
          post.media.secure_url = media.secure_url ; 
          }
        else{
          throw new Error('Unable to upload media') ; 
          }
        post = await Post.findById(post._id) ; 
        return res.status(200).send({ success: true, message: "Successfully added post" , data: post });
    }
    else throw new Error('Media is required') ; 
  } catch (error) {
      return res.status(400).send({ success: false, message: error.message , data: {}});
  }
};

const likePost = async  (req, res) => {
    try {
        const {postId} = req.body ; 
        if(!postId){
            res.send({success: false , message: "Post ID is required"}) ; 
        }
        // Like Post
        const post = await Post.findById(postId) ; 
        post.likes += 1 ; 
        await post.save() ; 
        res.send({success: true , post}) ; 
    } catch (error) {
        res.send({success: false , message: error.message}) ; 
    }
}

const deletePost = async (req, res)=>{
    try {
        const {postId} = req.body ; 
        if(!postId){
            res.send({success: false , message: "Post ID is required"}) ; 
        }
        // Delete Post
        const post = await Post.findByIdAndDelete(postId) ; 
        res.send({success: true , post}) ; 
    } catch (error) {
        res.send({success: false , message: error.message}) ; 
    }
};

export { createPost, deletePost, likePost };


