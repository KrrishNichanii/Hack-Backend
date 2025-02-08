import "Post" from "../models/post.model.js";

const createPost = async (req, res) => {
  try {
    const { title, content, media, tags, userId } = req.body;
    if (!title || !content) {
      res.send({ success: false, message: "All fields are required" });
    }
    // Create Post
    const post = await Post.create({
      title,
      content,
      media,
      tags,
      user,
    });

    res.send({ success: true, post });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};

const likePost = (req, res){
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

const deletePost = (req, res)=>{
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


